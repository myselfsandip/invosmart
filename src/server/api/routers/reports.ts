import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { invoices, customers, invoicePayments } from "@/server/db/schema";
import { eq, desc, and, gte, lte, inArray } from "drizzle-orm"; 
import { z } from "zod";

export const reportsRouter = createTRPCRouter({
    getFinancialReport: protectedProcedure
        .input(
            z.object({
                startDate: z.date().optional(),
                endDate: z.date().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const invoiceData = await db
                .select({
                    id: invoices.id,
                    invoiceNumber: invoices.invoiceNumber,
                    issueDate: invoices.issueDate,
                    dueDate: invoices.dueDate,
                    totalAmount: invoices.totalAmount,
                    status: invoices.status,
                    customerName: customers.name,
                    customerEmail: customers.email,
                })
                .from(invoices)
                .leftJoin(customers, eq(invoices.customerId, customers.id))
                .where(
                    and(
                        eq(invoices.userId, ctx.auth.user.id),
                        input.startDate ? gte(invoices.issueDate, input.startDate) : undefined,
                        input.endDate ? lte(invoices.issueDate, input.endDate) : undefined
                    )
                )
                .orderBy(desc(invoices.issueDate));

            if (invoiceData.length === 0) {
                return [];
            }

            const invoiceIds = invoiceData.map((inv) => inv.id);

            const payments = await db
                .select({
                    invoiceId: invoicePayments.invoiceId,
                    amount: invoicePayments.amountPaid,
                })
                .from(invoicePayments)
                .where(inArray(invoicePayments.invoiceId, invoiceIds));

            const paymentMap = new Map<string, number>();
            payments.forEach((p) => {
                const current = paymentMap.get(p.invoiceId) || 0;
                paymentMap.set(p.invoiceId, current + Number(p.amount));
            });

            // 5. Combine data
            const reportData = invoiceData.map((inv) => {
                const paidAmount = paymentMap.get(inv.id) || 0;
                const total = Number(inv.totalAmount);
                const balance = total - paidAmount;

                return {
                    ...inv,
                    totalAmount: total,
                    paidAmount,
                    balance: balance > 0.01 ? balance : 0, 
                };
            });

            return reportData;
        }),
});
