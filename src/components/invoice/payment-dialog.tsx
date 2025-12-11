"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { paymentCreateSchema } from "@/lib/validations/payment";
import { type InvoiceColumnType } from "@/app/user/invoices/invoice-columns";
import { useEffect } from "react";
import { z } from "zod";

interface PaymentDialogProps {
    invoice: InvoiceColumnType | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

// Inferred type from Zod
type PaymentFormValues = z.infer<typeof paymentCreateSchema>;

export const PaymentDialog = ({ invoice, open, onOpenChange, onSuccess }: PaymentDialogProps) => {
    const trpc = useTRPC();
    const addPaymentMutation = useMutation(trpc.payments.add.mutationOptions());

    const form = useForm({
        resolver: zodResolver(paymentCreateSchema),
        defaultValues: {
            invoiceId: "",
            amountPaid: 0,
            paymentDate: new Date(),
            paymentMethod: "upi" as const,
            notes: "",
            transactionId: "",
        }
    });

    useEffect(() => {
        if (invoice && open) {
            form.reset({
                invoiceId: invoice.id,
                amountPaid: 0,
                paymentDate: new Date(),
                paymentMethod: "upi",
                notes: "",
                transactionId: "",
            });
        }
    }, [invoice, open, form]);

    const onSubmit = (data: PaymentFormValues) => {
        addPaymentMutation.mutate(data, {
            onSuccess: () => {
                toast.success("Payment recorded successfully!");
                form.reset();
                onSuccess();
            },
            onError: (err: any) => {
                toast.error(err.message || "Failed to record payment");
            },
        });
    };

    if (!invoice) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Record Payment</DialogTitle>
                    <DialogDescription>
                        Invoice: {invoice.invoiceNumber} | Total: ₹{invoice.totalAmount.toFixed(2)}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            name="amountPaid"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount Paid *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            {...field}
                                            // FIX: Cast value to string | number explicitly to fix "Type '{}'..." error
                                            value={(field.value as string | number) ?? ""}
                                            // FIX: Use valueAsNumber to ensure proper type for numbers
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="paymentDate"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Date *</FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            date={field.value}
                                            onSelect={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="paymentMethod"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Method *</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="cash">Cash</SelectItem>
                                            <SelectItem value="upi">UPI</SelectItem>
                                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                            <SelectItem value="card">Card</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="transactionId"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Transaction ID (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., TXN123456"
                                            {...field}
                                            // FIX: Cast value here as well
                                            value={(field.value as string) ?? ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="notes"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Additional payment details..."
                                            {...field}
                                            // FIX: Cast value here as well
                                            value={(field.value as string) ?? ""}
                                            className="resize-none"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={addPaymentMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={addPaymentMutation.isPending}
                            >
                                {addPaymentMutation.isPending ? "Saving..." : "Save Payment"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
