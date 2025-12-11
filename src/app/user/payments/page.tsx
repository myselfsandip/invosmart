"use client";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Printer } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type PaymentRow = {
    id: string;
    amountPaid: string | number;
    paymentDate: string;
    paymentMethod: string;
    transactionId: string | null;
    notes: string | null;
    invoiceNumber: string;
    customerName: string | null;
};

const columns: ColumnDef<PaymentRow>[] = [
    {
        accessorKey: "paymentDate",
        header: "Date",
        cell: ({ row }) => {
            const value = row.original.paymentDate;
            return (
                <span className="whitespace-nowrap">
                    {format(new Date(value), "dd MMM yyyy")}
                </span>
            );
        },
    },
    {
        accessorKey: "invoiceNumber",
        header: "Invoice #",
        cell: ({ row }) => (
            <Badge variant="outline" className="font-mono">
                {row.original.invoiceNumber}
            </Badge>
        ),
    },
    {
        accessorKey: "customerName",
        header: "Customer",
        cell: ({ row }) => row.original.customerName || "—",
    },
    {
        accessorKey: "paymentMethod",
        header: "Method",
        cell: ({ row }) =>
            row.original.paymentMethod.replace(/_/g, " ").toLowerCase(),
    },
    {
        accessorKey: "transactionId",
        header: "Ref ID",
        cell: ({ row }) => (
            <span className="text-xs font-mono text-muted-foreground">
                {row.original.transactionId || "—"}
            </span>
        ),
    },
    {
        accessorKey: "amountPaid",
        header: "Amount",
        cell: ({ row }) => (
            <span className="font-semibold text-green-700">
                ₹{Number(row.original.amountPaid).toFixed(2)}
            </span>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const payment = row.original;
            return (
                <Button
                    variant="ghost"
                    size="icon"
                    title="Print receipt"
                    onClick={() =>
                        window.open(`/user/payments/${payment.id}/print`, "_blank")
                    }
                >
                    <Printer className="h-4 w-4 text-gray-500" />
                </Button>
            );
        },
        enableHiding: false,
    },
];

const PaymentsPage = () => {
    const trpc = useTRPC();

    const { data, isLoading } = useQuery(
        trpc.payments.getAll.queryOptions()
    );

    const rows: PaymentRow[] = (data ?? []).map((p) => ({
        id: p.id,
        amountPaid: p.amountPaid,
        paymentDate: p.paymentDate instanceof Date ? p.paymentDate.toISOString() : p.paymentDate,
        paymentMethod: p.paymentMethod,
        transactionId: p.transactionId,
        notes: p.notes,
        invoiceNumber: p.invoiceNumber,
        customerName: p.customerName,
    }));

    return (
        <div className="container max-w-6xl py-6 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Payments</h1>
                    <p className="text-sm text-muted-foreground">
                        View all payments and print receipts
                    </p>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={rows}
                isLoading={isLoading}
                filterKey="invoiceNumber"
            />
        </div>
    );
};

export default PaymentsPage;
