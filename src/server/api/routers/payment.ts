import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { and, eq, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { invoices, invoicePayments, customers, businessInfo } from "@/server/db/schema";
import { paymentCreateSchema } from "@/lib/validations/payment";
import { z } from "zod";

export const paymentsRouter = createTRPCRouter({
    add: protectedProcedure
        .input(paymentCreateSchema)
        .mutation(async ({ input, ctx }) => {
            const { invoiceId, amountPaid } = input;
            const userId = ctx.auth.user.id;

            return await db.transaction(async (tx) => {
                const [invoice] = await tx
                    .select({
                        id: invoices.id,
                        totalAmount: invoices.totalAmount,
                        status: invoices.status,
                    })
                    .from(invoices)
                    .where(
                        and(
                            eq(invoices.id, invoiceId),
                            eq(invoices.userId, userId)
                        )
                    )
                    .limit(1);

                if (!invoice) {
                    throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
                }

                const [newPayment] = await tx
                    .insert(invoicePayments)
                    .values({ ...input })
                    .returning();


                const result = await tx
                    .select({
                        totalPaid: sql<number>`COALESCE(sum(${invoicePayments.amountPaid}), 0)`.mapWith(Number),
                    })
                    .from(invoicePayments)
                    .where(eq(invoicePayments.invoiceId, invoiceId));

                const totalPaid = result[0]?.totalPaid ?? 0;
                const totalAmount = Number(invoice.totalAmount);
                const epsilon = 0.01; 

                let newStatus: "due" | "partially_paid" | "paid" = "due";

                if (totalPaid >= totalAmount - epsilon) {
                    newStatus = "paid";
                } else if (totalPaid > epsilon) {
                    newStatus = "partially_paid";
                } else {
                    newStatus = "due";
                }

                if (newStatus !== invoice.status) {
                    await tx
                        .update(invoices)
                        .set({ status: newStatus })
                        .where(eq(invoices.id, invoiceId));
                }

                return newPayment;
            });
        }),

    getByInvoice: protectedProcedure
        .input(z.object({ invoiceId: z.string() }))
        .query(async ({ input, ctx }) => {
            const [invoice] = await db
                .select({ id: invoices.id })
                .from(invoices)
                .where(and(
                    eq(invoices.id, input.invoiceId),
                    eq(invoices.userId, ctx.auth.user.id)
                ))
                .limit(1);

            if (!invoice) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return await db
                .select()
                .from(invoicePayments)
                .where(eq(invoicePayments.invoiceId, input.invoiceId))
                .orderBy(desc(invoicePayments.paymentDate)); 
        }),

    getAll: protectedProcedure.query(async ({ ctx }) => {
        return await db
            .select({
                id: invoicePayments.id,
                amountPaid: invoicePayments.amountPaid,
                paymentDate: invoicePayments.paymentDate,
                paymentMethod: invoicePayments.paymentMethod,
                transactionId: invoicePayments.transactionId,
                notes: invoicePayments.notes,
                invoiceNumber: invoices.invoiceNumber,
                customerName: customers.name,
            })
            .from(invoicePayments)
            .innerJoin(invoices, eq(invoicePayments.invoiceId, invoices.id))
            .leftJoin(customers, eq(invoices.customerId, customers.id))
            .where(eq(invoices.userId, ctx.auth.user.id))
            .orderBy(desc(invoicePayments.paymentDate));
    }),

    getReceipt: protectedProcedure
        .input(z.object({ paymentId: z.string() }))
        .query(async ({ ctx, input }) => {
            const [payment] = await db
                .select({
                    id: invoicePayments.id,
                    amountPaid: invoicePayments.amountPaid,
                    paymentDate: invoicePayments.paymentDate,
                    paymentMethod: invoicePayments.paymentMethod,
                    transactionId: invoicePayments.transactionId,
                    notes: invoicePayments.notes,
                    invoiceNumber: invoices.invoiceNumber,
                    invoiceTotal: invoices.totalAmount,
                    customer: {
                        name: customers.name,
                        address: customers.address,
                        email: customers.email,
                    },
                    business: {
                        name: businessInfo.businessName,
                        address: businessInfo.address,
                        phone: businessInfo.phone,
                        email: businessInfo.email,
                    }
                })
                .from(invoicePayments)
                .innerJoin(invoices, eq(invoicePayments.invoiceId, invoices.id))
                .leftJoin(customers, eq(invoices.customerId, customers.id))
                .leftJoin(businessInfo, eq(invoices.userId, businessInfo.userId))
                .where(
                    and(
                        eq(invoicePayments.id, input.paymentId),
                        eq(invoices.userId, ctx.auth.user.id)
                    )
                );

            if (!payment) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Receipt not found" });
            }

            return payment;
        }),
});
