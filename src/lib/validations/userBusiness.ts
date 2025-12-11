import { z } from "zod"

export const userBusinessSchema = z.object({
    businessName: z.string().trim().min(1, "Business name is required"),
    phone: z.string().trim().min(1, { message: "Phone is required" }),
    email: z.email({ message: "Invalid email" }),
    gstin: z.string().min(1, { message: "GST Number is required" }),
    address: z.string().trim().min(1, { message: "Address is required" }),
    pin: z.string().trim().min(1, { message: "PIN is required" }),
    state: z.string().trim().min(1, { message: "State is required" }),
});

export const userBusinessCreateSchema = userBusinessSchema.extend({})

export type UserBusinessType = z.infer<typeof userBusinessSchema>;
export type UserBusinessCreateType = z.infer<typeof userBusinessCreateSchema>;
