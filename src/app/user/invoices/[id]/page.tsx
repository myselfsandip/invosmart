"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Printer, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { PaymentDialog } from "@/components/invoice/payment-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

const InvoiceDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const invoiceId = params.id as string;
    const trpc = useTRPC();

    const { data: invoice, isLoading, refetch } = useQuery(
        trpc.invoices.getOne.queryOptions({ invoiceId })
    );

    const { data: payments } = useQuery(
        trpc.payments.getByInvoice.queryOptions({ invoiceId }),
    );

    const [showPaymentDialog, setShowPaymentDialog] = useState(false);

    const handlePrint = () => {
        window.open(`/user/invoices/${invoiceId}/print`, '_blank');
    };

    if (isLoading) {
        return <div className="p-8 flex items-center justify-center">Loading details...</div>;
    }

    if (!invoice) {
        return <div className="p-8">Invoice not found</div>;
    }

    const totalPaid = payments?.reduce((sum, p) => sum + Number(p.amountPaid), 0) || 0;
    const balance = Number(invoice.totalAmount) - totalPaid;

    return (
        <div className="container  py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Invoice {invoice.invoiceNumber}</h1>
                        <p className="text-muted-foreground text-sm">
                            Issued on {format(new Date(invoice.issueDate), "dd MMM yyyy")}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                    {invoice.status !== "paid" && (
                        <Button onClick={() => setShowPaymentDialog(true)}>
                            <CreditCard className="mr-2 h-4 w-4" /> Record Payment
                        </Button>
                    )}
                </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-4">
                <Badge variant={invoice.status === "paid" ? "default" : "outline"} className="capitalize text-sm px-3 py-1">
                    {invoice.status}
                </Badge>
                {balance > 0 && invoice.status !== "paid" && (
                    <span className="text-sm text-muted-foreground">
                        Balance Due: <span className="font-bold text-red-600">₹{balance.toFixed(2)}</span>
                    </span>
                )}
            </div>

            {/* Bill From / To */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Bill From */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Bill From</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                        {invoice.businessInfo ? (
                            <>
                                <p className="font-semibold">{invoice.businessInfo.businessName}</p>
                                {invoice.businessInfo.email && <p className="text-muted-foreground">{invoice.businessInfo.email}</p>}
                                <p className="text-muted-foreground">{invoice.businessInfo.address}</p>
                                <p className="text-muted-foreground">{invoice.businessInfo.state}, {invoice.businessInfo.pin}</p>
                                {invoice.businessInfo.gstin && <p className="text-muted-foreground font-medium">GSTIN: {invoice.businessInfo.gstin}</p>}
                            </>
                        ) : (
                            <p className="text-muted-foreground">No business details found</p>
                        )}
                    </CardContent>
                </Card>

                {/* Bill To */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Bill To</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                        {invoice.customer ? (
                            <>
                                <p className="font-semibold">{invoice.customer.name}</p>
                                {invoice.customer.email && <p className="text-muted-foreground">{invoice.customer.email}</p>}
                                <p className="text-muted-foreground">{invoice.customer.address}</p>
                                <p className="text-muted-foreground">{invoice.customer.state}, {invoice.customer.pin}</p>
                                {invoice.customer.gstNo && <p className="text-muted-foreground font-medium">GSTIN: {invoice.customer.gstNo}</p>}
                            </>
                        ) : (
                            <p className="text-muted-foreground">No customer assigned</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Items */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>HSN</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Tax</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoice.items?.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{item.name || `Item ${idx + 1}`}</TableCell>
                                    <TableCell>{item.hsnCode || "—"}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">₹{Number(item.unitPrice).toFixed(2)}</TableCell>
                                    <TableCell className="text-right">₹{Number(item.taxAmount).toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-medium">₹{Number(item.total).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="mt-6 flex justify-end">
                        <div className="w-72 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal:</span>
                                <span>₹{Number(invoice.subTotal).toFixed(2)}</span>
                            </div>
                            {Number(invoice.cgst) > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">CGST:</span>
                                    <span>₹{Number(invoice.cgst).toFixed(2)}</span>
                                </div>
                            )}
                            {Number(invoice.sgst) > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">SGST:</span>
                                    <span>₹{Number(invoice.sgst).toFixed(2)}</span>
                                </div>
                            )}
                            {Number(invoice.igst) > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">IGST:</span>
                                    <span>₹{Number(invoice.igst).toFixed(2)}</span>
                                </div>
                            )}
                            <Separator className="my-2" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total:</span>
                                <span>₹{Number(invoice.totalAmount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment History */}
            {payments && payments.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Payment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>{format(new Date(payment.paymentDate), "dd MMM yyyy")}</TableCell>
                                        <TableCell className="capitalize">{payment.paymentMethod.replace("_", " ")}</TableCell>
                                        <TableCell>{payment.transactionId || "—"}</TableCell>
                                        <TableCell className="text-right font-medium">₹{Number(payment.amountPaid).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="mt-4 flex justify-end gap-6 text-sm">
                            <div className="font-semibold">Total Paid: <span className="text-green-600">₹{totalPaid.toFixed(2)}</span></div>
                            <div className="font-semibold">Balance: <span className="text-red-600">₹{balance.toFixed(2)}</span></div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Notes */}
            {invoice.notes && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{invoice.notes}</p>
                    </CardContent>
                </Card>
            )}

            {showPaymentDialog && (
                <PaymentDialog
                    invoice={{
                        id: invoice.id,
                        invoiceNumber: invoice.invoiceNumber,
                        totalAmount: Number(invoice.totalAmount),
                        issueDate: invoice.issueDate,
                        dueDate: invoice.dueDate,
                        status: invoice.status,
                        customer: invoice.customer ? {
                            id: invoice.customer.id,
                            name: invoice.customer.name,
                            email: invoice.customer.email,
                        } : { id: null, name: null, email: null }
                    }}
                    open={showPaymentDialog}
                    onOpenChange={setShowPaymentDialog}
                    onSuccess={() => {
                        refetch();
                        setShowPaymentDialog(false);
                    }}
                />
            )}
        </div>
    );
};

export default InvoiceDetailPage;
