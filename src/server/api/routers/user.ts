import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { businessInfo, userBank } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { businessInfoSchema, bankDetailsSchema } from "@/lib/validations/user";

export const userRouter = createTRPCRouter({
    // Business Info
    getBusinessInfo: protectedProcedure.query(async ({ ctx }) => {
        const [result] = await db
            .select()
            .from(businessInfo)
            .where(eq(businessInfo.userId, ctx.auth.user.id))
            .limit(1);

        return result ?? null;
    }),

    upsertBusinessInfo: protectedProcedure
        .input(businessInfoSchema)
        .mutation(async ({ input, ctx }) => {
            const userId = ctx.auth.user.id;

            // Check if business info already exists
            const [existing] = await db
                .select()
                .from(businessInfo)
                .where(eq(businessInfo.userId, userId))
                .limit(1);

            if (existing) {
                // Update existing
                const [updated] = await db
                    .update(businessInfo)
                    .set({ ...input })
                    .where(eq(businessInfo.userId, userId))
                    .returning();
                return updated;
            } else {
                // Create new
                const [created] = await db
                    .insert(businessInfo)
                    .values({ userId, ...input })
                    .returning();
                return created;
            }
        }),

    // Bank Details
    getBankDetails: protectedProcedure.query(async ({ ctx }) => {
        const [result] = await db
            .select()
            .from(userBank)
            .where(eq(userBank.userId, ctx.auth.user.id))
            .limit(1);

        return result ?? null;
    }),

    upsertBankDetails: protectedProcedure
        .input(bankDetailsSchema)
        .mutation(async ({ input, ctx }) => {
            const userId = ctx.auth.user.id;

            // Check if bank details already exist
            const [existing] = await db
                .select()
                .from(userBank)
                .where(eq(userBank.userId, userId))
                .limit(1);

            if (existing) {
                // Update existing
                const [updated] = await db
                    .update(userBank)
                    .set({ ...input })
                    .where(eq(userBank.userId, userId))
                    .returning();
                return updated;
            } else {
                // Create new
                const [created] = await db
                    .insert(userBank)
                    .values({ userId, ...input })
                    .returning();
                return created;
            }
        }),

    deleteBankDetails: protectedProcedure.mutation(async ({ ctx }) => {
        const [deleted] = await db
            .delete(userBank)
            .where(eq(userBank.userId, ctx.auth.user.id))
            .returning({ id: userBank.id });

        if (!deleted) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Bank details not found",
            });
        }

        return deleted;
    }),
});

export type UserRouterType = typeof userRouter;
