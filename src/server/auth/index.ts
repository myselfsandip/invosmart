import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";



export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    // socialProviders: {
    //     google: {
    //         clientId: process.env.GOOGLE_CLIENT_ID as string,
    //         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    //     },
    // },
    emailAndPassword: {
        enabled: true
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            ...schema
        }
    }),
    advanced: {
        database: {
            generateId: false //using nanoid() in the schema
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                input: false,
            },
        }
    },
    plugins: [
        nextCookies(),
        admin({
            defaultRole: 'user',
        }),
    ]
});