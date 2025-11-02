import { z } from "zod";
import { createTRPCRouter, protectedProcedure, } from "../trpc";
import { db } from "@/server/db";
import { invoiceItems, invoices } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { invoiceCreateSchema, invoiceUpdateSchema } from "@/lib/validations/invoice";
import { TRPCError } from "@trpc/server";



export const invoiceRouter = createTRPCRouter({
    getAll: protectedProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.auth.user.id;
            return await db.select().from(invoices)
                .innerJoin(invoiceItems, eq(invoices.id, invoiceItems.invoiceId))
                .where(eq(invoices.userId, userId));
        }),
    getOne: protectedProcedure
        .input(z.object({
            invoiceId: z.string().trim().min(1, { message: "Invoice ID is required" }),
        }))
        .query(async ({ input, ctx }) => {
            const userId = ctx.auth.user.id;
            const [result] = await db.select().from(invoices)
                .innerJoin(invoiceItems, eq(invoices.id, invoiceItems.invoiceId))
                .where(and(eq(invoices.id, input.invoiceId), eq(invoices.userId, userId)))
                .limit(1);
            if (!result) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Invoice not found"
                })
            }
            return result;
        }),
    create: protectedProcedure
        .input(invoiceCreateSchema)
        .mutation(async ({ input, ctx }) => {
            return await db.transaction(async (tx) => {
                const [createdInvoice] = await tx.insert(invoices).values({
                    invoiceNumber: input.invoiceNumber,
                    userId: ctx.auth.user.id,
                    customerId: input.customerId,
                    issueDate: input.issueDate,
                    dueDate: input.dueDate,
                    subTotal: input.subTotal,
                    discount: input.discount,
                    totalAmount: input.totalAmount,
                    notes: input.notes,
                    cgst: input.cgst ?? 0,
                    sgst: input.sgst ?? 0,
                    igst: input.igst ?? 0,
                }).returning();

                await Promise.all(
                    input.items.map((item) =>
                        tx.insert(invoiceItems).values({
                            invoiceId: createdInvoice.id,
                            hsnCode: item.hsnCode ?? '',
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            discount: item.discount,
                            cgst: item.tax,
                            sgst: item.gst,
                            total: item.total,
                        })
                    )
                );
                return createdInvoice;
            })
        }),
    update: protectedProcedure
        .input(z.object({
            invoiceId: z.string().trim().min(1, { message: "Invoice id is required" }),
        }).extend(invoiceUpdateSchema.shape))
        .mutation(async function ({ input, ctx }) {
            return await db.transaction(async (tx) => {
                //Step 1 - Update Invoice data
                const [updatedInvoice] = await tx.update(invoices).set({
                    invoiceNumber: input.invoiceNumber,
                    userId: ctx.auth.user.id,
                    customerId: input.customerId,
                    issueDate: input.issueDate,
                    dueDate: input.dueDate,
                    subTotal: input.subTotal,
                    discount: input.discount,
                    totalAmount: input.totalAmount,
                    notes: input.notes,
                    cgst: input.cgst ?? 0,
                    sgst: input.sgst ?? 0,
                    igst: input.igst ?? 0,
                })
                    .where(and(eq(invoices.id, input.invoiceId), eq(invoices.userId, ctx.auth.user.id)))
                    .returning();

                if (!updatedInvoice) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Invoice not found or you lack permission to update it"
                    })
                }
                //Delete the existing items then add the new items 
                await tx.delete(invoiceItems).where(eq(invoiceItems.invoiceId, input.invoiceId));
                // Insert Parallaly
                await Promise.all(
                    input.items.map(item => {
                        const base = item.unitPrice * item.quantity;
                        const taxAmount = base * ((item.tax ?? 0) + (item.gst ?? 0)) / 100;
                        const total = (base * (1 - item.discount / 100)) + taxAmount;
                        return tx.insert(invoiceItems).values({
                            invoiceId: input.invoiceId,
                            hsnCode: item.hsnCode,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            discount: item.discount,
                            cgst: item.tax,
                            sgst: item.gst,
                            total: total,
                        });
                    }
                    )
                );
                return updatedInvoice;
            })
        }),
    delete: protectedProcedure
        .input(z.object({
            invoiceId: z.string().trim().min(1, { message: "Invoice id is required" }),
        }))
        .mutation(async ({ input, ctx }) => {
            return await db.transaction(async (tx) => {
                const result = await tx.delete(invoices)
                    .where(and(
                        eq(invoices.id, input.invoiceId),
                        eq(invoices.userId, ctx.auth.user.id)
                    ))
                    .returning({ id: invoices.id });
                if (result.length === 0) {
                    throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found or you lack permission to delete it" });
                }
                return { success: true, deletedId: result[0].id };
            });
        }),
});


export type invoiceRouterType = typeof invoiceRouter;