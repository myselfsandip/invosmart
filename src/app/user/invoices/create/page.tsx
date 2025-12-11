"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    invoiceCreateSchema,
    type InvoiceCreateType,
    type InvoiceFormValues // IMPORT THIS NEW TYPE
} from "@/lib/validations/invoice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { IndianRupee, TrashIcon, PlusIcon, Calculator } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const CreateInvoicePage = () => {
    const trpc = useTRPC();
    const router = useRouter();

    const [taxType, setTaxType] = useState<"intra" | "inter">("intra");

    const { data: customers } = useQuery(trpc.customer.getAll.queryOptions());
    const { data: businessInfo } = useQuery(trpc.user.getBusinessInfo.queryOptions());

    const createInvoiceMutation = useMutation(trpc.invoices.create.mutationOptions());

    // USE InvoiceFormValues HERE to allow string inputs
    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceCreateSchema),
        defaultValues: {
            invoiceNumber: `INV-${Date.now()}`,
            customerId: "",
            issueDate: new Date(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            items: [
                {
                    name: "",
                    hsnCode: "",
                    quantity: 1,
                    unitPrice: 0,
                    discount: 0,
                    gstRate: 0,
                    cgst: 0,
                    sgst: 0,
                    igst: 0,
                    taxAmount: 0,
                    total: 0,
                },
            ],
            enableTax: true,
            subTotal: 0,
            cgst: 0,
            sgst: 0,
            igst: 0,
            discount: 0,
            totalAmount: 0,
            notes: "",
            status: "due",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const watchedItems = useWatch({
        control: form.control,
        name: "items",
    });
    const watchCustomerId = form.watch("customerId");
    const watchEnableTax = form.watch("enableTax");

    // Auto-detect Tax Type
    useEffect(() => {
        if (watchCustomerId && businessInfo?.state && customers) {
            const selectedCustomer = customers.find((c) => c.id === watchCustomerId);
            if (selectedCustomer?.state) {
                const isIntra = selectedCustomer.state.toLowerCase() === businessInfo.state.toLowerCase();
                setTaxType(isIntra ? "intra" : "inter");
            }
        }
    }, [watchCustomerId, businessInfo, customers]);

    // Calculations
    const calculations = useMemo(() => {
        let subTotal = 0;
        let totalTaxAmount = 0;
        let totalCGSTAmount = 0;
        let totalSGSTAmount = 0;
        let totalIGSTAmount = 0;

        const safeItems = watchedItems || [];

        const calculatedItems = safeItems.map((item) => {
            // Cast inputs to number safely for calculation
            const quantity = Number(item.quantity) || 0;
            const unitPrice = Number(item.unitPrice) || 0;
            const baseAmount = quantity * unitPrice;

            const itemDiscountPercent = Number(item.discount) || 0;
            const discountAmount = (baseAmount * itemDiscountPercent) / 100;
            const taxableValue = baseAmount - discountAmount;

            let taxAmount = 0;
            let cgstRate = 0;
            let sgstRate = 0;
            let igstRate = 0;

            if (watchEnableTax) {
                const rate = Number(item.gstRate) || 0;

                if (taxType === "intra") {
                    cgstRate = rate / 2;
                    sgstRate = rate / 2;

                    const cgstVal = (taxableValue * cgstRate) / 100;
                    const sgstVal = (taxableValue * sgstRate) / 100;

                    taxAmount = cgstVal + sgstVal;
                    totalCGSTAmount += cgstVal;
                    totalSGSTAmount += sgstVal;
                } else {
                    igstRate = rate;
                    const igstVal = (taxableValue * rate) / 100;

                    taxAmount = igstVal;
                    totalIGSTAmount += igstVal;
                }
            }

            const total = taxableValue + taxAmount;
            subTotal += taxableValue;
            totalTaxAmount += taxAmount;

            return {
                ...item,
                // Amounts for Display
                calculatedTotal: total,
                calculatedTax: taxAmount,
                // Rates/Values for Submission
                cgst: cgstRate,
                sgst: sgstRate,
                igst: igstRate,
                taxAmount: taxAmount,
                total: total,
            };
        });

        const totalAmount = subTotal + totalTaxAmount;

        return {
            calculatedItems,
            subTotal,
            totalCGSTAmount,
            totalSGSTAmount,
            totalIGSTAmount,
            totalTaxAmount,
            totalAmount,
        };
    }, [watchedItems, watchEnableTax, taxType]);

    const handleSubmit = (data: InvoiceFormValues) => {

        const safeData = data as unknown as InvoiceCreateType;

        const submissionItems = calculations.calculatedItems.map((item) => ({
            name: item.name,
            hsnCode: item.hsnCode || "",
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            discount: Number(item.discount),
            gstRate: Number(item.gstRate),
            cgst: item.cgst,
            sgst: item.sgst,
            igst: item.igst,
            taxAmount: item.taxAmount,
            total: item.total
        }));

        const submissionData = {
            ...safeData, // Use the safe data
            items: submissionItems,
            subTotal: calculations.subTotal,
            totalAmount: calculations.totalAmount,
            cgst: 0,
            sgst: 0,
            igst: 0,
            discount: 0,
        };

        createInvoiceMutation.mutate(submissionData, {
            onSuccess: () => {
                toast.success("Invoice created successfully");
                router.push("/user/invoices");
            },
            onError: (error: any) => {
                console.error("Submission Error:", error);
                toast.error(error.message || "Failed to create invoice");
            },
        });
    };

    return (
        <div className="container max-w-6xl py-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Create Invoice</h1>
                    <p className="text-muted-foreground">Create a new invoice for your customer</p>
                </div>
            </div>

            <Form {...form}>
                {/* Pass handleSubmit which receives the transformed data */}
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">Invoice Settings</CardTitle>
                            <Calculator className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-8">
                                <FormField
                                    control={form.control}
                                    name="enableTax"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm gap-4">
                                            <div className="space-y-0.5">
                                                <FormLabel>Tax Invoice (GST)</FormLabel>
                                                <FormDescription>Enable GST calculation</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {watchEnableTax && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-md border text-sm">
                                        <span className="font-medium">Detected Mode:</span>
                                        <span className={cn(
                                            "font-bold uppercase",
                                            taxType === "intra" ? "text-blue-600" : "text-purple-600"
                                        )}>
                                            {taxType === "intra" ? "Intra-State (CGST + SGST)" : "Inter-State (IGST)"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="md:col-span-3">
                            <CardContent className="pt-6">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="invoiceNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Invoice Number</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="INV-001" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="issueDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Issue Date</FormLabel>
                                                <FormControl>
                                                    <DatePicker
                                                        date={field.value}
                                                        onSelect={field.onChange}
                                                        placeholder="Select issue date"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="dueDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Due Date</FormLabel>
                                                <FormControl>
                                                    <DatePicker
                                                        date={field.value}
                                                        onSelect={field.onChange}
                                                        placeholder="Select due date"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-1 h-full">
                            <CardHeader>
                                <CardTitle className="text-lg">Bill From (Business)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {businessInfo ? (
                                    <div className="space-y-2 text-sm">
                                        <p className="font-bold text-base">{businessInfo.businessName}</p>
                                        <p className="text-muted-foreground">{businessInfo.address}</p>
                                        <p className="text-muted-foreground">
                                            {businessInfo.address}, {businessInfo.state} - {businessInfo.pin}
                                        </p>
                                        <div className="pt-2 mt-2 border-t">
                                            {businessInfo.gstin && <p><span className="font-medium">GSTIN:</span> {businessInfo.gstin}</p>}
                                            <p><span className="font-medium">Phone:</span> {businessInfo.phone}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
                                        Business info missing
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2 h-full">
                            <CardHeader>
                                <CardTitle className="text-lg">Bill To (Customer)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="customerId"
                                    render={({ field }) => (
                                        <FormItem className="mb-4">
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a customer" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {customers?.map((customer) => (
                                                        <SelectItem key={customer.id} value={customer.id}>
                                                            {customer.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {watchCustomerId && (() => {
                                    const customer = customers?.find(c => c.id === watchCustomerId);
                                    if (!customer) return null;
                                    return (
                                        <div className="p-4 bg-muted/20 rounded-lg border space-y-2 text-sm">
                                            <p className="font-bold text-base">{customer.name}</p>
                                            <p className="text-muted-foreground">{customer.address}, {customer.state}</p>
                                            <div className="flex gap-4 pt-2 mt-2 border-t">
                                                {customer.gstNo && <p><span className="font-medium">GSTIN:</span> {customer.gstNo}</p>}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Items & Services</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto rounded-md border">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="min-w-[220px]">Item Details</TableHead>
                                            <TableHead className="w-[100px]">HSN/SAC</TableHead>
                                            <TableHead className="w-[80px]">Qty</TableHead>
                                            <TableHead className="w-[120px]">Price</TableHead>
                                            <TableHead className="w-[90px]">Disc %</TableHead>
                                            {watchEnableTax && (
                                                <TableHead className="w-[100px]">GST %</TableHead>
                                            )}
                                            <TableHead className="w-[140px] text-right">Amount</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fields.map((field, index) => (
                                            <TableRow key={field.id}>
                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`items.${index}.name`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input {...field} placeholder="Item name"  />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`items.${index}.hsnCode`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input {...field} placeholder="HSN" className="h-8" />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`items.${index}.quantity`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        // React Hook Form handles string/number logic naturally now
                                                                        className="h-8"
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`items.${index}.unitPrice`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        className="h-8"
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FormField
                                                        control={form.control}
                                                        name={`items.${index}.discount`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        className="h-8 text-muted-foreground"
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                {watchEnableTax && (
                                                    <TableCell>
                                                        <FormField
                                                            control={form.control}
                                                            name={`items.${index}.gstRate`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            placeholder="18"
                                                                            className="h-8"
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        {/* Visual feedback */}
                                                        {(Number(watchedItems?.[index]?.gstRate) || 0) > 0 && (
                                                            <div className="text-[10px] text-muted-foreground mt-1">
                                                                {taxType === "intra"
                                                                    ? `C:${Number(watchedItems?.[index]?.gstRate || 0) / 2}% S:${Number(watchedItems?.[index]?.gstRate || 0) / 2}%`
                                                                    : `IGST: ${watchedItems?.[index]?.gstRate}%`
                                                                }
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                )}
                                                <TableCell className="text-right align-top font-medium">
                                                    ₹{calculations.calculatedItems[index]?.calculatedTotal.toFixed(2) || "0.00"}
                                                    {watchEnableTax && (
                                                        <div className="text-[10px] text-muted-foreground font-normal">
                                                            Tax: ₹{calculations.calculatedItems[index]?.calculatedTax.toFixed(2)}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => remove(index)}
                                                        disabled={fields.length === 1}
                                                        className="h-8 w-8 hover:text-red-600"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => append({
                                    name: "",
                                    hsnCode: "",
                                    quantity: 1,
                                    unitPrice: 0,
                                    discount: 0,
                                    gstRate: 0,
                                    cgst: 0, sgst: 0, igst: 0, taxAmount: 0, total: 0
                                })}
                            >
                                <PlusIcon className="mr-2 h-4 w-4" /> Add Item
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Terms & Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Bank details, Payment terms, etc."
                                                    className="min-h-[150px] resize-none"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card >
                            <CardContent className="pt-6 space-y-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Taxable Value (Subtotal)</span>
                                        <span>₹{calculations.subTotal.toFixed(2)}</span>
                                    </div>

                                    {watchEnableTax && (
                                        <>
                                            <Separator className="my-2" />
                                            {taxType === "intra" ? (
                                                <>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Total CGST</span>
                                                        <span>₹{calculations.totalCGSTAmount.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Total SGST</span>
                                                        <span>₹{calculations.totalSGSTAmount.toFixed(2)}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Total IGST</span>
                                                    <span>₹{calculations.totalIGSTAmount.toFixed(2)}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <Separator className="bg-slate-200" />

                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold">Grand Total</span>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold flex items-center gap-1">
                                            <IndianRupee className="h-5 w-5" />
                                            {calculations.totalAmount.toFixed(2)}
                                        </span>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            (Inclusive of all taxes)
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-end gap-4 pb-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={createInvoiceMutation.isPending}
                            className="min-w-[150px]"
                        >
                            {createInvoiceMutation.isPending ? "Creating..." : "Create Invoice"}
                        </Button>
                    </div>

                </form>
            </Form>
        </div>
    );
};

export default CreateInvoicePage;
