import { z } from "zod";

export const paymentCreateSchema = z.object({
    invoiceId: z.string().min(1),
    amountPaid: z.coerce.number().min(0.01, "Amount must be greater than zero"),
    paymentDate: z.date(),
    paymentMethod: z.enum(["cash", "bank_transfer", "card", "upi"]),
    notes: z.string().optional(),
    transactionId: z.string().optional(),
});

export type PaymentCreateType = z.infer<typeof paymentCreateSchema>;
