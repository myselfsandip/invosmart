import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { z } from "zod";
import { invoiceRouter } from "./routers/invoiceRouter";


export const appRouter = createTRPCRouter({
    hello: publicProcedure
        .input(
            z.object({
                text: z.string(),
            }),
        )
        .query((opts) => {
            return {
                greeting: `hello ${opts.input.text}`,
            };
        }),
    invoice: invoiceRouter
});


// export type definition of API
export type AppRouter = typeof appRouter;