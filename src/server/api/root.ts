import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { exampleRouter } from "./routers/exampleRouter";
import { z } from "zod";


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
    example: exampleRouter
});


// export type definition of API
export type AppRouter = typeof appRouter;