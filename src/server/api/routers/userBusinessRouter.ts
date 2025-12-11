import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/server/db";
import { businessInfo } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { userBusinessCreateSchema } from "@/lib/validations/userBusiness";


export const userBusinessRouter = createTRPCRouter({
    create: protectedProcedure
        .input(userBusinessCreateSchema)
        .mutation(async ({ input, ctx }) => {
            const [createdData] = await db.insert(businessInfo).values({
                ...input,
                userId: ctx.auth.user.id
            }).returning();
            return createdData;
        }),
    update: protectedProcedure
        .input(z.object({
            businessInfoId: z.string().trim().min(1, { message: "Businessinfo Id is required" }),
        }).extend(userBusinessCreateSchema.shape))
        .mutation(async ({ input, ctx }) => {
            const [updatedData] = await db.update(businessInfo).set({
                ...input,
            }).where(and(eq(businessInfo.id, input.businessInfoId), eq(businessInfo.userId, ctx.auth.user.id))).returning();
            return updatedData;
        })
});

export type userBusinessRouterType = typeof userBusinessRouter;