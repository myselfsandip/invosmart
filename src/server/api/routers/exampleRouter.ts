import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";



export const exampleRouter = createTRPCRouter({
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
});


export type exampleRouterType = typeof exampleRouter;