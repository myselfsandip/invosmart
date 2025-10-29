import { auth } from '@/server/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { cache } from 'react';
import superjson from 'superjson';
import { ZodError } from 'zod';


/**
 * Creates the tRPC context with authentication data.
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = cache(async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return {
        auth: session || null, // Include session in context, null if no session
    };
});

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<typeof createTRPCContext>().create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;  //Public Routes
//Protected Routes
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
    const session = ctx.auth;
    if (!session) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User session not found. Please log in.' });
    }
    return next({ ctx: { ...ctx, auth: session } });
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
    const role = ctx.auth.user.role;
    if (role !== 'admin') {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to access this resource',
        });
    }
    return next();
});