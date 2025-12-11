import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { z } from "zod";
import { invoicesRouter } from "./routers/invoiceRouter";
import { customersRouter } from "./routers/customersRouter";
import { userRouter } from "./routers/user";
import { paymentsRouter } from "./routers/payment";
import { reportsRouter } from "./routers/reports";
import { dashboardRouter } from "./routers/dashboard";


export const appRouter = createTRPCRouter({
    invoices: invoicesRouter,
    customer: customersRouter,
    user: userRouter,
    payments: paymentsRouter,
    reports: reportsRouter,
    dashboard: dashboardRouter,
});


// export type definition of API
export type AppRouter = typeof appRouter;