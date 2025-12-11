import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { customers } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { customerCreateSchema } from "@/lib/validations/customer";



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
    create: protectedProcedure
        .input(customerCreateSchema)
        .mutation(async ({ input, ctx }) => {
            const userId = ctx.auth.user.id;
            const [createdCustomer] = await db.insert(customers).values({
                userId: userId,
                ...input
            }).returning();
            return createdCustomer;
        }),
    update: protectedProcedure
        .input(z.object({
            customerId: z.string().trim().min(1, { message: "Customer id is required" }),
        }).extend(customerCreateSchema.shape))
        .mutation(async ({ input, ctx }) => {
            const [updatedCustomer] = await db.update(customers).set({
                ...input,
                userId: ctx.auth.user.id
            }).where(and(eq(customers.id, input.customerId), eq(customers.userId, ctx.auth.user.id))).returning();
            return updatedCustomer;
        }),
    delete: protectedProcedure
        .input(z.object({
            customerId: z.string().trim().min(1, { message: "Customer Id is required" }),
        }))
        .mutation(async ({ input, ctx }) => {
            const [deletedCustomer] = await db.delete(customers)
                .where(and(eq(customers.id, input.customerId), eq(customers.userId, ctx.auth.user.id)))
                .returning({ customerId: customers.id, name: customers.name });
            return deletedCustomer;
        })
});

export type customerRouterType = typeof customersRouter;