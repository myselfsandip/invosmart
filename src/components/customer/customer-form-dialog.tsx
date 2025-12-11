"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerCreateSchema, CustomerCreateType, CustomerBaseType } from "@/lib/validations/customer";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

interface CustomerFormDialogProps {
    mode: "create" | "edit";
    initialData?: CustomerBaseType | null;
    onSubmit: (values: CustomerCreateType) => void;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function CustomerFormDialog({
    mode,
    initialData,
    onSubmit,
    trigger,
    open,
    onOpenChange
}: CustomerFormDialogProps) {

    const form = useForm<CustomerCreateType>({
        resolver: zodResolver(customerCreateSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            gstNo: "",
            address: "",
            pin: "",
            state: ""
        }
    });

    // Update form when initialData changes (for edit mode)
    useEffect(() => {
        if (initialData && mode === "edit") {
            form.reset({
                name: initialData.name,
                phone: initialData.phone,
                email: initialData.email ?? "",
                gstNo: initialData.gstNo ?? "",
                address: initialData.address,
                pin: initialData.pin,
                state: initialData.state,
            });
        } else if (mode === "create") {
            form.reset({
                name: "",
                phone: "",
                email: "",
                gstNo: "",
                address: "",
                pin: "",
                state: ""
            });
        }
    }, [initialData, mode, form]);

    const handleSubmitForm = (values: CustomerCreateType) => {
        onSubmit(values);
        if (mode === "create") {
            form.reset();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogTitle>
                    {mode === "create" ? "Add Customer" : "Edit Customer"}
                </DialogTitle>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmitForm)} noValidate>
                        <div className="grid gap-4 py-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Customer name" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Phone number" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="email@example.com"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="gstNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>GST Number</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="GST number" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                className="min-h-[80px]"
                                                placeholder="Full address"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="pin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>PIN Code</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="PIN code" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="State" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {mode === "create" ? "Create" : "Update"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
