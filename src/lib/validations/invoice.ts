import { z } from "zod"

export const invoiceSchema = z.object({
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    issueDate: z.date({
        message: "Issue date is required",
    }),
    dueDate: z.date({
        message: "Due date is required",
    }),
    customerId: z.string().trim().min(1, { message: "Customer ID is required" }),
    items: z.array(
        z.object({
            name: z.string().trim().min(1, { message: "Product name is required" }),
            hsnCode: z.string().optional(),
            quantity: z.number().min(1, "Quantity must be at least 1"),
            unitPrice: z.number().min(0, "Price must be positive"),
            discount: z.number().min(0).max(100).default(0),
            tax: z.number().min(0).max(100).default(0),
            gst: z.number().min(0).max(100).default(0),
            total: z.number(),
        })
    ).min(1, "At least one item is required"),
    subTotal: z.number(),
    cgst: z.number().min(0).max(100).default(0),
    sgst: z.number().min(0).max(100).default(0),
    igst: z.number().min(0).max(100).default(0),
    discount: z.number(),
    totalAmount: z.number(),
    notes: z.string().optional(),
    paymentTerms: z.string().optional(),
});

export const invoiceCreateSchema = invoiceSchema.extend({
    userId: z.string().trim().min(1, { message: "User ID is required" }),
})

export const invoiceUpdateSchema = invoiceCreateSchema.extend({});

export type InvoiceType = z.infer<typeof invoiceSchema>;
export type InvoiceCreateType = z.infer<typeof invoiceCreateSchema>;
export type InvoiceUpdateType = z.infer<typeof invoiceUpdateSchema>;