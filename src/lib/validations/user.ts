import { z } from "zod";

// Business Info Schema
export const businessInfoSchema = z.object({
    businessName: z.string().trim().min(1, "Business name is required"),
    phone: z.string().trim().min(1, "Phone is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    gstin: z.string().trim().optional().or(z.literal("")),
    address: z.string().trim().min(1, "Address is required"),
    pin: z.string().trim().min(1, "PIN is required"),
    state: z.string().trim().min(1, "State is required"),
});

export const baseBusinessInfoSchema = z.object({
    id: z.string(),
    userId: z.string(),
    businessName: z.string(),
    phone: z.string(),
    email: z.string().nullish(),
    gstin: z.string().nullish(),
    address: z.string(),
    pin: z.string(),
    state: z.string(),
});

// Bank Details Schema
export const bankDetailsSchema = z.object({
    accountHolderName: z.string().trim().min(1, "Account holder name is required"),
    bankName: z.string().trim().min(1, "Bank name is required"),
    branchName: z.string().trim().optional().or(z.literal("")),
    accountNumber: z.string().trim().min(1, "Account number is required"),
    ifscCode: z.string().trim().min(1, "IFSC code is required").toUpperCase(),
    upiId: z.string().trim().optional().or(z.literal("")),
});

export const baseBankDetailsSchema = z.object({
    id: z.string(),
    userId: z.string(),
    accountHolderName: z.string(),
    bankName: z.string(),
    branchName: z.string().nullish(),
    accountNumber: z.string(),
    ifscCode: z.string(),
    upiId: z.string().nullish(),
});

// Types
export type BusinessInfoType = z.infer<typeof businessInfoSchema>;
export type BaseBusinessInfoType = z.infer<typeof baseBusinessInfoSchema>;

export type BankDetailsType = z.infer<typeof bankDetailsSchema>;
export type BaseBankDetailsType = z.infer<typeof baseBankDetailsSchema>;
