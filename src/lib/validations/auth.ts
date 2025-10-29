import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(1, 'Password must be at least 1 characters long')
});

export const signupSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name is too long'),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .max(100, 'Password is too long'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, { message: "Current password is required" }),
    newPassword: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z
        .string()
        .min(1, { message: "Please confirm your password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
});


export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>