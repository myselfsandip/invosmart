import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { invoices, invoiceItems, customers, businessInfo, userBank } from "@/server/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { invoiceCreateSchema } from "@/lib/validations/invoice";

export const invoicesRouter = createTRPCRouter({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        return await db
            .select({
                id: invoices.id,
                invoiceNumber: invoices.invoiceNumber,
                issueDate: invoices.issueDate,
                dueDate: invoices.dueDate,
                totalAmount: invoices.totalAmount,
                status: invoices.status,
                customer: {
                    id: customers.id,
                    name: customers.name,
                    email: customers.email,
                },
            })
            .from(invoices)
            .leftJoin(customers, eq(invoices.customerId, customers.id))
            .where(eq(invoices.userId, ctx.auth.user.id))
            .orderBy(desc(invoices.createdAt)); // Show newest first
    }),

    getOne: protectedProcedure
        .input(z.object({ invoiceId: z.string().trim().min(1) }))
        .query(async ({ input, ctx }) => {
            const [invoice] = await db
                .select()
                .from(invoices)
                .where(
                    and(
                        eq(invoices.id, input.invoiceId),
                        eq(invoices.userId, ctx.auth.user.id)
                    )
                )
                .limit(1);

            if (!invoice) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Invoice not found",
                });
            }

            const items = await db
                .select()
                .from(invoiceItems)
                .where(eq(invoiceItems.invoiceId, invoice.id));

            const [customer] = await db
                .select()
                .from(customers)
                .where(eq(customers.id, invoice.customerId));

            const [business] = await db
                .select()
                .from(businessInfo)
                .where(eq(businessInfo.userId, ctx.auth.user.id))
                .limit(1);

            const [bank] = await db
                .select()
                .from(userBank)
                .where(eq(userBank.userId, ctx.auth.user.id))
                .limit(1);

            return {
                ...invoice,
                items,
                customer,
                businessInfo: business || null,
                bankInfo: bank || null,
            };
        }),


    create: protectedProcedure
        .input(invoiceCreateSchema)
        .mutation(async ({ input, ctx }) => {
            const userId = ctx.auth.user.id;
            const { items, ...invoiceData } = input;

            const [existing] = await db
                .select()
                .from(invoices)
                .where(eq(invoices.invoiceNumber, input.invoiceNumber))
                .limit(1);

            if (existing) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Invoice number already exists",
                });
            }

            const result = await db.transaction(async (tx) => {
                const [createdInvoice] = await tx
                    .insert(invoices)
                    .values({
                        userId,
                        ...invoiceData,
                    })
                    .returning();

                if (items && items.length > 0) {
                    await tx.insert(invoiceItems).values(
                        items.map((item) => ({
                            invoiceId: createdInvoice.id,
                            name: item.name,
                            quantity: item.quantity,
                            hsnCode: item.hsnCode || null,
                            unitPrice: item.unitPrice,
                            discount: item.discount,
                            cgst: item.cgst,
                            sgst: item.sgst,
                            igst: item.igst,
                            taxAmount: item.taxAmount,
                            total: item.total,
                        }))
                    );
                }

                return createdInvoice;
            });

            return result;
        }),

    update: protectedProcedure
        .input(
            z.object({
                invoiceId: z.string().trim().min(1),
            }).merge(invoiceCreateSchema)
        )
        .mutation(async ({ input, ctx }) => {
            const { invoiceId, items, ...invoiceData } = input;

            // Verify ownership
            const [existing] = await db
                .select()
                .from(invoices)
                .where(
                    and(
                        eq(invoices.id, invoiceId),
                        eq(invoices.userId, ctx.auth.user.id)
                    )
                )
                .limit(1);

            if (!existing) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Invoice not found",
                });
            }

            // Update invoice and items in a transaction
            const result = await db.transaction(async (tx) => {
                const [updatedInvoice] = await tx
                    .update(invoices)
                    .set(invoiceData)
                    .where(eq(invoices.id, invoiceId))
                    .returning();

                await tx
                    .delete(invoiceItems)
                    .where(eq(invoiceItems.invoiceId, invoiceId));

                if (items && items.length > 0) {
                    await tx.insert(invoiceItems).values(
                        items.map((item) => ({
                            invoiceId: updatedInvoice.id,
                            name: item.name,
                            quantity: item.quantity,
                            hsnCode: item.hsnCode || null,
                            unitPrice: item.unitPrice,
                            discount: item.discount,
                            cgst: item.cgst,
                            sgst: item.sgst,
                            igst: item.igst,
                            taxAmount: item.taxAmount,
                            total: item.total,
                        }))
                    );
                }

                return updatedInvoice;
            });

            return result;
        }),

    delete: protectedProcedure
        .input(z.object({ invoiceId: z.string().trim().min(1) }))
        .mutation(async ({ input, ctx }) => {
            const [deleted] = await db
                .delete(invoices)
                .where(
                    and(
                        eq(invoices.id, input.invoiceId),
                        eq(invoices.userId, ctx.auth.user.id)
                    )
                )
                .returning({ id: invoices.id, invoiceNumber: invoices.invoiceNumber });

            if (!deleted) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Invoice not found",
                });
            }

            return deleted;
        }),

    updateStatus: protectedProcedure
        .input(
            z.object({
                invoiceId: z.string().trim().min(1),
                status: z.enum(["due", "partially_paid", "paid"]),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const [updated] = await db
                .update(invoices)
                .set({ status: input.status })
                .where(
                    and(
                        eq(invoices.id, input.invoiceId),
                        eq(invoices.userId, ctx.auth.user.id)
                    )
                )
                .returning();

            if (!updated) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Invoice not found",
                });
            }

            return updated;
        }),
});

export type InvoicesRouterType = typeof invoicesRouter;
