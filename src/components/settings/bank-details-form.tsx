"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bankDetailsSchema, BankDetailsType, BaseBankDetailsType } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { useEffect } from "react";

interface BankDetailsFormProps {
    initialData?: BaseBankDetailsType | null;
    onSubmit: (values: BankDetailsType) => void;
    onDelete?: () => void;
    isLoading?: boolean;
}

export function BankDetailsForm({ initialData, onSubmit, onDelete, isLoading }: BankDetailsFormProps) {
    const form = useForm<BankDetailsType>({
        resolver: zodResolver(bankDetailsSchema),
        defaultValues: {
            accountHolderName: "",
            bankName: "",
            branchName: "",
            accountNumber: "",
            ifscCode: "",
            upiId: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                accountHolderName: initialData.accountHolderName,
                bankName: initialData.bankName,
                branchName: initialData.branchName ?? "",
                accountNumber: initialData.accountNumber,
                ifscCode: initialData.ifscCode,
                upiId: initialData.upiId ?? "",
            });
        }
    }, [initialData, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="accountHolderName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account Holder Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Full name as per bank account" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="bankName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bank Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g., HDFC Bank" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="branchName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Branch Name (Optional)</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Branch location" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="accountNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Number</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Bank account number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ifscCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>IFSC Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="e.g., HDFC0001234"
                                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="upiId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>UPI ID (Optional)</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="yourname@upi" />
                                </FormControl>
                                <FormDescription>
                                    Your UPI ID for receiving payments
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-3">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Bank Details"}
                    </Button>
                    {initialData && onDelete && (
                        <Button type="button" variant="destructive" onClick={onDelete} disabled={isLoading}>
                            Delete Bank Details
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
}
