import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { customers } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";



export const customersRouter = createTRPCRouter({
    getAll: protectedProcedure
        .query(async ({ ctx }) => {
            return await db.select().from(customers).where(eq(customers.userId, ctx.auth.user.id));
        }),
    getOne: protectedProcedure
        .input(z.object({
            customerId: z.string().trim().min(1, { message: "Customer ID is required" }),
        }))
        .query(async ({ input, ctx }) => {
            const userId = ctx.auth.user.id;
            const [result] = await db.select().from(customers)
                .where(and(eq(customers.id, input.customerId), eq(customers.userId, userId)))
                .limit(1);
            if (!result) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Customer not found"
                })
            }
            return result;
        }),
})