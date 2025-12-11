"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { format, startOfMonth, endOfMonth } from "date-fns";
import {
    Download,
    TrendingUp,
    AlertCircle,
    CheckCircle2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

type ReportItem = {
    id: string;
    invoiceNumber: string;
    issueDate: Date;
    dueDate: Date;
    totalAmount: number;
    paidAmount: number;
    balance: number;
    status: string;
    customerName: string | null;
    customerEmail: string | null;
};

export default function ReportsPage() {
    const trpc = useTRPC();

    const [startDate, setStartDate] = useState<string>(format(startOfMonth(new Date()), "yyyy-MM-dd"));
    const [endDate, setEndDate] = useState<string>(format(endOfMonth(new Date()), "yyyy-MM-dd"));

    // Fetch Data
    const { data: reportData, isLoading } = useQuery(
        trpc.reports.getFinancialReport.queryOptions({
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        })
    );

    const summary = useMemo(() => {
        if (!reportData) return { totalRevenue: 0, totalCollected: 0, totalOutstanding: 0 };

        return reportData.reduce(
            (acc, curr) => {
                acc.totalRevenue += Number(curr.totalAmount) || 0;
                acc.totalCollected += Number(curr.paidAmount) || 0;
                acc.totalOutstanding += Number(curr.balance) || 0;
                return acc;
            },
            { totalRevenue: 0, totalCollected: 0, totalOutstanding: 0 }
        );
    }, [reportData]);

    const downloadCSV = () => {
        if (!reportData || reportData.length === 0) return;

        // Define CSV Headers
        const headers = ["Invoice No", "Date", "Customer Name", "Total Amount", "Paid Amount", "Balance Due", "Status"];

        // Map Data to CSV Rows
        const rows = reportData.map(row => [
            row.invoiceNumber,
            format(new Date(row.issueDate), "yyyy-MM-dd"),
            `"${row.customerName || ''}"`, // Quote strings to handle commas
            row.totalAmount.toFixed(2),
            row.paidAmount.toFixed(2),
            row.balance.toFixed(2),
            row.status.toUpperCase()
        ]);

        // Combine Headers and Rows
        const csvContent = [
            headers.join(","),
            ...rows.map(e => e.join(","))
        ].join("\n");

        // Trigger Download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Financial_Report_${format(new Date(), "yyyy-MM-dd")}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- TABLE COLUMNS CONFIGURATION ---
    const columns: ColumnDef<ReportItem>[] = [
        {
            accessorKey: "invoiceNumber",
            header: "Invoice #",
            cell: ({ row }) => <span className="font-medium">{row.original.invoiceNumber}</span>
        },
        {
            accessorKey: "issueDate",
            header: "Date",
            cell: ({ row }) => format(new Date(row.original.issueDate), "dd/MM/yyyy")
        },
        {
            accessorKey: "customerName",
            header: "Customer",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.customerName || "Unknown"}</span>
                    {row.original.customerEmail && (
                        <span className="text-xs text-muted-foreground hidden sm:inline">{row.original.customerEmail}</span>
                    )}
                </div>
            )
        },
        {
            accessorKey: "totalAmount",
            header: () => <div >Total</div>,
            cell: ({ row }) => <div className=" font-medium">₹{row.original.totalAmount.toFixed(2)}</div>
        },
        {
            accessorKey: "paidAmount",
            header: () => <div >Paid</div>,
            cell: ({ row }) => <div className=" text-green-600">₹{row.original.paidAmount.toFixed(2)}</div>
        },
        {
            accessorKey: "balance",
            header: () => <div >Balance</div>,
            cell: ({ row }) => {
                const bal = row.original.balance;
                return <div className={` ${bal > 0 ? "text-red-600 font-medium" : "text-gray-500"}`}>
                    {bal > 0 ? `₹${bal.toFixed(2)}` : "-"}
                </div>;
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const balance = row.original.balance;
                const status = row.original.status;

                // Custom logic: if balance is 0, show PAID green badge, else show status
                const isPaid = balance <= 0.1; // epsilon for float

                return (
                    <Badge variant={isPaid ? "default" : status === 'overdue' ? "destructive" : "secondary"}>
                        {isPaid ? "PAID" : status.toUpperCase()}
                    </Badge>
                );
            }
        }
    ];

    return (
        <div className="p-6  mx-auto space-y-6">

            {/* HEADER & CONTROLS */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Financial Report</h1>
                    <p className="text-muted-foreground">Overview of your invoices and payments.</p>
                </div>

                <div className="flex flex-wrap items-end gap-3 bg-card p-3 rounded-lg border shadow-sm">
                    <div className="space-y-1">
                        <Label htmlFor="start" className="text-xs">Start Date</Label>
                        <Input
                            id="start"
                            type="date"
                            className="h-9 w-[140px]"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="end" className="text-xs">End Date</Label>
                        <Input
                            id="end"
                            type="date"
                            className="h-9 w-[140px]"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <Button onClick={downloadCSV} disabled={isLoading || !reportData?.length} size="sm" className="h-9">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{summary.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground">Total value of generated invoices</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{summary.totalCollected.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground">Actual amount received</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">₹{summary.totalOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground">Unpaid amount from customers</p>
                    </CardContent>
                </Card>
            </div>

            {/* DATA TABLE */}
            <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle>Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={reportData || []}
                        isLoading={isLoading}
                        filterKey="customerName" // Enable searching by Customer Name
                    />
                </CardContent>
            </Card>
        </div>
    );
}
