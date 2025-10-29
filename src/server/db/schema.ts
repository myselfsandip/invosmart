import { pgTable, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);
export const statusEnum = pgEnum("status", ["active", "inactive"]);


export const user = pgTable("user", {
    id: text('id').primaryKey().$default(() => nanoid()),
    role: userRoleEnum('role').notNull().default('user'),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    banned: boolean("banned").default(false),
    banReason: text('ban_reason'),
    banExpires: timestamp('ban_expires', { mode: 'date' }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const session = pgTable("session", {
    id: text('id').primaryKey().$default(() => nanoid()),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => new Date())
        .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
    id: text('id').primaryKey().$default(() => nanoid()),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => new Date())
        .notNull(),
});

export const verification = pgTable("verification", {
    id: text('id').primaryKey().$default(() => nanoid()),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const address = pgTable("address", {
    id: text("id").primaryKey().$default(() => nanoid()),
    country: text("country").notNull(),
    state: text("state").notNull(),
    city: text("city").notNull(),
    addressLine1: text("address_line_1").notNull(),
    addressLine2: text("address_line_2"),
    pincode: text("pincode").notNull(),
    status: pgEnum("address_status", ["1", "0"])("status").default("1").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customers = pgTable("customers", {
    id: text("id").primaryKey().$default(() => nanoid()),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    billingAddressId: text("billing_address_id")
        .references(() => address.id, { onDelete: "set null" }),
    shippingAddressId: text("shipping_address_id")
        .references(() => address.id, { onDelete: "set null" }),
    status: statusEnum("status").default("active").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});