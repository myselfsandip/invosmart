"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Printer, CreditCard, Eye, Trash } from "lucide-react";
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import Link from "next/link";

// FIX: Allow 'customer' to be null to match the data source types
export type InvoiceColumnType = {
    id: string;
    invoiceNumber: string;
    issueDate: Date;
    dueDate: Date;
    totalAmount: number;
    status: "due" | "partially_paid" | "paid";
    customer: {
        id: string | null;
        name: string | null;
        email: string | null;
    } | null;
};

export const getInvoiceColumns = (
    onPrint: (id: string) => void,
    onPayment: (inv: InvoiceColumnType) => void,
    onDelete: (id: string) => void
): ColumnDef<InvoiceColumnType>[] => [
        {
            accessorKey: "invoiceNumber",
            header: "Invoice #",
            cell: ({ row }) => (
                <Link href={`/user/invoices/${row.original.id}`} className="font-medium hover:underline text-blue-600">
                    {row.original.invoiceNumber}
                </Link>
            ),
        },
        {
            accessorKey: "customer.name",
            header: "Customer",
            cell: ({ row }) => {
                const customer = row.original.customer;
                return (
                    <div className="flex flex-col">
                        <span className="font-medium">{customer?.name ?? "Unknown Customer"}</span>
                        {customer?.email && (
                            <span className="text-xs text-muted-foreground">{customer.email}</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "issueDate",
            header: "Issue Date",
            cell: ({ row }) => format(new Date(row.original.issueDate), "dd MMM yyyy"),
        },
        {
            accessorKey: "dueDate",
            header: "Due Date",
            cell: ({ row }) => format(new Date(row.original.dueDate), "dd MMM yyyy"),
        },
        {
            accessorKey: "totalAmount",
            header: () => <div className="text-right">Amount</div>,
            cell: ({ row }) => (
                <div className="font-medium">
                    ₹{Number(row.original.totalAmount).toFixed(2)}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status;
                const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
                    paid: "default",
                    partially_paid: "secondary",
                    due: "outline",
                };
                return <Badge variant={variants[status] || "outline"} className="capitalize">{status}</Badge>;
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const invoice = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/user/invoices/${invoice.id}`}>
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onPrint(invoice.id)}>
                                <Printer className="mr-2 h-4 w-4" /> Print Invoice
                            </DropdownMenuItem>
                            {invoice.status !== "paid" && (
                                <DropdownMenuItem onClick={() => onPayment(invoice)}>
                                    <CreditCard className="mr-2 h-4 w-4" /> Record Payment
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(invoice.id)}
                                className="text-red-600 focus:text-red-600"
                            >
                                <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
