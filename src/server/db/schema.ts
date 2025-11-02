import { pgTable, text, timestamp, boolean, pgEnum, integer, numeric, customType } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);
export const statusEnum = pgEnum("status", ["active", "inactive"]);
export const addressStatusEnum = pgEnum("address_status", ["1", "0"]);
export const invoiceStatusEnum = pgEnum("invoice_status", ["draft", "sent", "paid", "overdue"]);
export const paymentMethodEnum = pgEnum("payment_method", ["cash", "bank_transfer", "card", "upi"]);

type NumericConfig = {
    precision?: number
    scale?: number
}

// Taken From : https://github.com/drizzle-team/drizzle-orm/issues/1042#issuecomment-2224689025
export const numericCasted = customType<{
    data: number
    driverData: string
    config: NumericConfig
}>({
    dataType: (config) => {
        if (config?.precision && config?.scale) {
            return `numeric(${config.precision}, ${config.scale})`
        }
        return 'numeric'
    },
    fromDriver: (value: string) => Number.parseFloat(value), // note: precision loss for very large/small digits so area to refactor if needed
    toDriver: (value: number) => value.toString(),
});



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
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
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
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .$onUpdate(() => new Date())
        .notNull(),
});

export const verification = pgTable("verification", {
    id: text('id').primaryKey().$default(() => nanoid()),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

/* ========== BUSINESS INFO ========== */
export const businessInfo = pgTable("business_info", {
    id: text("id").primaryKey().$default(() => nanoid()),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    businessName: text("business_name").notNull(),
    address: text("address").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    gstin: text("gstin"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

/* ========== ADDRESS ========== */
export const address = pgTable("address", {
    id: text("id").primaryKey().$default(() => nanoid()),
    country: text("country").notNull(),
    state: text("state").notNull(),
    city: text("city").notNull(),
    addressLine1: text("address_line_1").notNull(),
    addressLine2: text("address_line_2"),
    pincode: text("pincode").notNull(),
    status: addressStatusEnum("status").default("1").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ========== CUSTOMERS ========== */
export const customers = pgTable("customers", {
    id: text("id").primaryKey().$default(() => nanoid()),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    gstNo: text("gst_no"),
    billingAddressId: text("billing_address_id").references(() => address.id, { onDelete: "set null" }),
    shippingAddressId: text("shipping_address_id").references(() => address.id, { onDelete: "set null" }),
    status: statusEnum("status").default("active").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

/* ========== PRODUCTS ========== */
// export const products = pgTable("products", {
//     id: text("id").primaryKey().$default(() => nanoid()),
//     name: text("name").notNull(),
//     description: text("description"),
//     sku: text("sku"),
//     price: numeric("price", { precision: 10, scale: 2 }).notNull(),
//     taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).default("0.00"),
//     status: statusEnum("status").default("active").notNull(),
//     createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
// });

/* ========== INVOICES ========== */
export const invoices = pgTable("invoices", {
    id: text("id").primaryKey().$default(() => nanoid()),
    invoiceNumber: text("invoice_number").notNull().unique(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    customerId: text("customer_id").references(() => customers.id, { onDelete: "cascade" }),
    issueDate: timestamp("issue_date").notNull(),
    dueDate: timestamp("due_date").notNull(),
    subTotal: numericCasted("sub_total", { precision: 12, scale: 2 }).notNull().default(0),
    cgst: numericCasted("cgst", { precision: 5, scale: 2 }).notNull().default(0),
    sgst: numericCasted("sgst", { precision: 5, scale: 2 }).notNull().default(0),
    igst: numericCasted("igst", { precision: 5, scale: 2 }).notNull().default(0),
    discount: numericCasted("discount", { precision: 5, scale: 2 }).notNull().default(0), //Percentage
    totalAmount: numericCasted("total_amount", { precision: 12, scale: 2 }).notNull(),
    status: invoiceStatusEnum("status").default("draft").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

/* ========== INVOICE ITEMS ========== */
export const invoiceItems = pgTable("invoice_items", {
    id: text("id").primaryKey().$default(() => nanoid()),
    invoiceId: text("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    hsnCode: text("hsn_code"),
    unitPrice: numericCasted("unit_price", { precision: 10, scale: 2 }).notNull(),
    discount: numericCasted("discount", { precision: 5, scale: 2 }) //Percentage
        .notNull()
        .default(0),
    cgst: numericCasted("cgst", { precision: 5, scale: 2 })
        .notNull()
        .default(0),
    sgst: numericCasted("sgst", { precision: 5, scale: 2 })
        .notNull()
        .default(0),
    igst: numericCasted("igst", { precision: 5, scale: 2 })
        .notNull()
        .default(0),
    taxAmount: numericCasted("tax_amount", { precision: 12, scale: 2 })
        .notNull()
        .default(0),
    total: numericCasted("total", { precision: 12, scale: 2 })
        .notNull()
        .default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

/* ========== INVOICE PAYMENTS ========== */
export const invoicePayments = pgTable("invoice_payments", {
    id: text("id").primaryKey().$default(() => nanoid()),
    invoiceId: text("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
    amountPaid: numericCasted("amount_paid", { precision: 12, scale: 2 }).notNull(),
    paymentDate: timestamp("payment_date").defaultNow().notNull(),
    paymentMethod: paymentMethodEnum("payment_method").default("cash").notNull(),
    transactionId: text("transaction_id"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

/* ========== SUBSCRIPTION PLANS ========== */
export const subscriptionPlans = pgTable("subscription_plans", {
    id: text("id").primaryKey().$default(() => nanoid()),
    name: text("name").notNull().unique(), // e.g. "Free", "Pro", "Enterprise"
    description: text("description"),
    price: numericCasted("price", { precision: 10, scale: 2 }).notNull().default(0),
    billingCycle: text("billing_cycle").default("monthly"), // monthly, yearly
    maxInvoices: integer("max_invoices").default(50), // usage limit
    maxCustomers: integer("max_customers").default(100),
    status: statusEnum("status").default("active").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

/* ========== USER SUBSCRIPTIONS ========== */
export const userSubscriptions = pgTable("user_subscriptions", {
    id: text("id").primaryKey().$default(() => nanoid()),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    planId: text("plan_id").notNull().references(() => subscriptionPlans.id, { onDelete: "restrict" }),
    startDate: timestamp("start_date").defaultNow().notNull(),
    endDate: timestamp("end_date"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const userBank = pgTable("user_bank", {
    id: text('id').primaryKey().$default(() => nanoid()),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accountHolderName: text("account_holder_name").notNull(),
    bankName: text("bank_name").notNull(),
    branchName: text("branch_name"),
    accountNumber: text("account_number").notNull(),
    ifscCode: text("ifsc_code").notNull(),
    upiId: text("upi_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});