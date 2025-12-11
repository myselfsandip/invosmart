import { z } from "zod"

const statusEnum = z.enum(["active", "inactive"]);

export const customerSchema = z.object({
    name: z.string().trim().min(1, "Customer name is required"),
    phone: z.string().trim().min(1, { message: "Phone is required" }),
    email: z.email({ message: "Invalid email" }),
    gstNo: z.string().min(1, { message: "GST is required" }),
    address: z.string().trim().min(1, { message: "Address is required" }),
    pin: z.string().trim().min(1, { message: "PIN is required" }),
    state: z.string().trim().min(1, { message: "State is required" }),
});


export const baseCustomerSchema = z.object({
    id: z.string().min(1, { message: "ID is required" }),
    userId: z.string().min(1, { message: "User id is required" }),
    name: z.string().trim().min(1, "Customer name is required"),
    phone: z.string().trim().min(1, { message: "Phone is required" }),
    email: z.email({ message: "Invalid email" }).nullish(),
    gstNo: z.string().min(1, { message: "GST is required" }).nullish(),
    address: z.string().trim().min(1, { message: "Address is required" }),
    pin: z.string().trim().min(1, { message: "PIN is required" }),
    state: z.string().trim().min(1, { message: "State is required" }),
    status: statusEnum
});

export const customerCreateSchema = customerSchema.extend({})

export type CustomerBaseType = z.infer<typeof baseCustomerSchema>;
export type CustomerType = z.infer<typeof customerSchema>;
export type CustomerCreateType = z.infer<typeof customerCreateSchema>;
