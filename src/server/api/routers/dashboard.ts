import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { invoices, invoicePayments, customers } from "@/server/db/schema";
import { and, eq, sql, gte, inArray } from "drizzle-orm";
import { subDays, format } from "date-fns";

export const dashboardRouter = createTRPCRouter({
    getStats: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.auth.user.id;
        const now = new Date();

        const [revenueResult] = await db
            .select({
                total: sql<number>`COALESCE(sum(${invoicePayments.amountPaid}), 0)`.mapWith(Number)
            })
            .from(invoicePayments)
            .innerJoin(invoices, eq(invoicePayments.invoiceId, invoices.id))
            .where(eq(invoices.userId, userId));

        const [customerResult] = await db
            .select({ count: sql<number>`count(*)` })
            .from(customers)
            .where(eq(customers.userId, userId));


        const pendingInvoices = await db
            .select({
                id: invoices.id,
                totalAmount: invoices.totalAmount,
            })
            .from(invoices)
            .where(and(
                eq(invoices.userId, userId),
                inArray(invoices.status, ["due", "partially_paid"])
            ));

        let totalPendingValue = 0;

        if (pendingInvoices.length > 0) {
            const pendingInvoiceIds = pendingInvoices.map(inv => inv.id);

            const paymentsForPending = await db
                .select({
                    invoiceId: invoicePayments.invoiceId,
                    amount: invoicePayments.amountPaid
                })
                .from(invoicePayments)
                .where(inArray(invoicePayments.invoiceId, pendingInvoiceIds));

            const paymentMap = new Map<string, number>();
            paymentsForPending.forEach(p => {
                const current = paymentMap.get(p.invoiceId) || 0;
                paymentMap.set(p.invoiceId, current + Number(p.amount));
            });

            // Sum up the balances
            for (const inv of pendingInvoices) {
                const paid = paymentMap.get(inv.id) || 0;
                const balance = Number(inv.totalAmount) - paid;
                if (balance > 0.01) { 
                    totalPendingValue += balance;
                }
            }
        }

        const ninetyDaysAgo = subDays(now, 90);

        const rawChartData = await db
            .select({
                date: sql<string>`TO_CHAR(${invoicePayments.paymentDate}, 'YYYY-MM-DD')`,
                revenue: sql<number>`sum(${invoicePayments.amountPaid})`.mapWith(Number)
            })
            .from(invoicePayments)
            .innerJoin(invoices, eq(invoicePayments.invoiceId, invoices.id))
            .where(and(
                eq(invoices.userId, userId),
                gte(invoicePayments.paymentDate, ninetyDaysAgo)
            ))
            .groupBy(sql`TO_CHAR(${invoicePayments.paymentDate}, 'YYYY-MM-DD')`)
            .orderBy(sql`TO_CHAR(${invoicePayments.paymentDate}, 'YYYY-MM-DD')`);

        const filledChartData: { date: string; revenue: number }[] = [];
        const dataMap = new Map(rawChartData.map((d) => [d.date, d.revenue]));

        for (let i = 90; i >= 0; i--) {
            const d = subDays(now, i);
            const dateStr = format(d, 'yyyy-MM-dd');
            filledChartData.push({
                date: dateStr,
                revenue: dataMap.get(dateStr) || 0
            });
        }

        return {
            revenue: revenueResult?.total || 0,
            totalCustomers: Number(customerResult?.count || 0),
            pendingInvoicesCount: pendingInvoices.length,
            pendingInvoicesValue: totalPendingValue,
            chartData: filledChartData
        };
    })
});
