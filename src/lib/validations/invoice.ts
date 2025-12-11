import { z } from "zod";

// Helper: Accepts string/number, transforms to number, validates min/max
const quantityRule = z.union([z.string(), z.number()])
    .transform((val) => (val === "" ? 0 : Number(val)))
    .pipe(z.number().min(1, "Qty min 1"));

const amountRule = z.union([z.string(), z.number()])
    .transform((val) => (val === "" ? 0 : Number(val)))
    .pipe(z.number().min(0, "Min 0"));

const percentRule = z.union([z.string(), z.number()])
    .transform((val) => (val === "" ? 0 : Number(val)))
    .pipe(z.number().min(0).max(100, "Max 100%"));

const gstRule = z.union([z.string(), z.number()])
    .transform((val) => (val === "" ? 0 : Number(val)))
    .pipe(z.number().min(0).max(40, "Max 40%"));


export const invoiceItemSchema = z.object({
    name: z.string().min(1, "Item name is required"),
    hsnCode: z.string().optional(),
    quantity: quantityRule,
    unitPrice: amountRule,
    discount: percentRule.optional().default(0),
    gstRate: gstRule.optional().default(0),

    cgst: z.number().optional().default(0),
    sgst: z.number().optional().default(0),
    igst: z.number().optional().default(0),
    taxAmount: z.number().optional().default(0),
    total: z.number().optional().default(0),
});

export const invoiceCreateSchema = z.object({
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    customerId: z.string().min(1, "Customer is required"),
    issueDate: z.date(),
    dueDate: z.date(),
    items: z.array(invoiceItemSchema).min(1, "Add at least one item"),
    status: z.enum(["due", "partially_paid", "paid"]),
    notes: z.string().optional(),
    enableTax: z.boolean().default(true),

    subTotal: z.number().optional().default(0),
    discount: z.number().optional().default(0),
    totalAmount: z.number().optional().default(0),

    cgst: z.number().optional().default(0),
    sgst: z.number().optional().default(0),
    igst: z.number().optional().default(0),
});


export type InvoiceCreateType = z.infer<typeof invoiceCreateSchema>;

export type InvoiceFormValues = z.input<typeof invoiceCreateSchema>;
