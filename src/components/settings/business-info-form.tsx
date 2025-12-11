"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessInfoSchema, BusinessInfoType, BaseBusinessInfoType } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useEffect } from "react";

interface BusinessInfoFormProps {
    initialData?: BaseBusinessInfoType | null;
    onSubmit: (values: BusinessInfoType) => void;
    isLoading?: boolean;
}

export function BusinessInfoForm({ initialData, onSubmit, isLoading }: BusinessInfoFormProps) {
    const form = useForm<BusinessInfoType>({
        resolver: zodResolver(businessInfoSchema),
        defaultValues: {
            businessName: "",
            phone: "",
            email: "",
            gstin: "",
            address: "",
            pin: "",
            state: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                businessName: initialData.businessName,
                phone: initialData.phone,
                email: initialData.email ?? "",
                gstin: initialData.gstin ?? "",
                address: initialData.address,
                pin: initialData.pin,
                state: initialData.state,
            });
        }
    }, [initialData, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Your business name" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
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
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email (Optional)</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" placeholder="business@example.com" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="gstin"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>GSTIN (Optional)</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="GST Identification Number" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Textarea {...field} className="min-h-[80px]" placeholder="Full address" />
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

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Business Info"}
                </Button>
            </form>
        </Form>
    );
}
