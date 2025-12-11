"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { format } from "date-fns";
import { useEffect, useMemo } from "react";

const PrintInvoicePage = () => {
    const params = useParams();
    const invoiceId = params.id as string;
    const trpc = useTRPC();

    const { data: invoice, isLoading } = useQuery(
        trpc.invoices.getOne.queryOptions({ invoiceId })
    );

    const { data: payments } = useQuery(trpc.payments.getByInvoice.queryOptions({ invoiceId }));

    useEffect(() => {
        if (invoice && !isLoading) {
            setTimeout(() => window.print(), 800);
        }
    }, [invoice, isLoading]);

    const calculations = useMemo(() => {
        if (!invoice) return null;

        const totalPaid = payments?.reduce((sum, p) => sum + Number(p.amountPaid), 0) || 0;
        const balance = Number(invoice.totalAmount) - totalPaid;

        const totalTaxAmount = invoice.items.reduce((sum, item) => sum + (Number(item.taxAmount) || 0), 0);
        const isInterState = invoice.items.some(item => Number(item.igst) > 0);
        const hasTax = totalTaxAmount > 0;

        return {
            totalPaid,
            balance,
            totalTaxAmount,
            isInterState,
            hasTax
        };
    }, [invoice, payments]);

    if (isLoading) return <div className="p-8">Loading invoice...</div>;
    if (!invoice || !calculations) return <div className="p-8">Invoice not found</div>;

    const bank = (invoice as any).bankInfo as {
        accountHolderName: string;
        bankName: string;
        accountNumber: string;
        ifscCode: string;
        branchName?: string;
        upiId?: string;
    } | null;

    return (
        <>
            <style jsx global>{`
                @media print {
                    @page { 
                        margin: 0;
                        size: auto;
                    }
                    
                    /* Hide everything by default */
                    body * {
                        visibility: hidden;
                    }

                    /* Unhide the print wrapper and its children */
                    .print-invoice-wrapper, .print-invoice-wrapper * {
                        visibility: visible;
                    }

                    /* Position the wrapper at the top-left corner */
                    .print-invoice-wrapper {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 10mm; /* Add print margin here */
                        background: white;
                    }

                    /* Ensure background colors print */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }

                /* Screen view styles */
                @media screen {
                    .print-invoice-wrapper {
                        max-width: 210mm;
                        margin: 20px auto;
                        border: 1px solid #ddd;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    }
                }
            `}</style>

            <div className="print-invoice-wrapper bg-white">
                <div className="p-10 text-black font-sans text-sm leading-tight">

                    {/* --- HEADER --- */}
                    <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-black">
                        <div>
                            <h1 className="text-4xl font-bold mb-1">INVOICE</h1>
                            <p className="text-lg font-semibold text-gray-700">#{invoice.invoiceNumber}</p>
                        </div>
                        <div className="text-right text-sm">
                            <p className="mb-1"><strong>Issue Date:</strong> {format(new Date(invoice.issueDate), "dd/MM/yyyy")}</p>
                            <p className="mb-1"><strong>Due Date:</strong> {format(new Date(invoice.dueDate), "dd/MM/yyyy")}</p>
                            <p><strong>Status:</strong> <span className="uppercase font-bold">{invoice.status}</span></p>
                        </div>
                    </div>

                    {/* --- ADDRESSES --- */}
                    <div className="flex justify-between gap-8 mb-8">
                        {/* Bill From */}
                        <div className="w-1/2">
                            <h3 className="font-bold uppercase text-xs text-gray-500 mb-2 border-b border-gray-300 pb-1">Bill From</h3>
                            {invoice.businessInfo ? (
                                <div className="text-sm">
                                    <p className="font-bold text-base mb-1">{invoice.businessInfo.businessName}</p>
                                    <p className="whitespace-pre-wrap">{invoice.businessInfo.address}</p>
                                    <p>{invoice.businessInfo.state} - {invoice.businessInfo.pin}</p>
                                    {invoice.businessInfo.gstin && <p className="mt-2 font-semibold">GSTIN: {invoice.businessInfo.gstin}</p>}
                                    {invoice.businessInfo.phone && <p>Phone: {invoice.businessInfo.phone}</p>}
                                </div>
                            ) : <p className="italic text-gray-500">Business details missing</p>}
                        </div>

                        {/* Bill To */}
                        <div className="w-1/2 text-right">
                            <h3 className="font-bold uppercase text-xs text-gray-500 mb-2 border-b border-gray-300 pb-1">Bill To</h3>
                            {invoice.customer ? (
                                <div className="text-sm">
                                    <p className="font-bold text-base mb-1">{invoice.customer.name}</p>
                                    <p className="whitespace-pre-wrap">{invoice.customer.address}</p>
                                    <p>{invoice.customer.state} - {invoice.customer.pin}</p>
                                    {invoice.customer.gstNo && <p className="mt-2 font-semibold">GSTIN: {invoice.customer.gstNo}</p>}
                                    {invoice.customer.phone && <p>Phone: {invoice.customer.phone}</p>}
                                </div>
                            ) : <p className="italic text-gray-500">Customer details missing</p>}
                        </div>
                    </div>

                    {/* --- ITEMS TABLE --- */}
                    <div className="mb-2">
                        <table className="w-full border-collapse border border-black text-xs">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-black p-2 text-left w-[40%]">Item</th>
                                    <th className="border border-black p-2 text-left w-[10%]">HSN/SAC</th>
                                    <th className="border border-black p-2 text-right w-[8%]">Qty</th>
                                    <th className="border border-black p-2 text-right w-[12%]">Price</th>
                                    <th className="border border-black p-2 text-right w-[8%]">Disc</th>

                                    {/* Hide Tax Header if Non-Taxable */}
                                    {calculations.hasTax && (
                                        <th className="border border-black p-2 text-right w-[10%]">Tax</th>
                                    )}

                                    <th className="border border-black p-2 text-right w-[12%]">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items?.map((item, idx) => {
                                    const gstRate = Number(item.igst) > 0
                                        ? Number(item.igst)
                                        : (Number(item.cgst) + Number(item.sgst));

                                    return (
                                        <tr key={idx}>
                                            <td className="border border-black p-2 font-medium">{item.name}</td>
                                            <td className="border border-black p-2">{item.hsnCode || "-"}</td>
                                            <td className="border border-black p-2 text-right">{item.quantity}</td>
                                            <td className="border border-black p-2 text-right">₹{Number(item.unitPrice).toFixed(2)}</td>
                                            <td className="border border-black p-2 text-right">
                                                {Number(item.discount) > 0 ? `${Number(item.discount)}%` : "-"}
                                            </td>

                                            {calculations.hasTax && (
                                                <td className="border border-black p-2 text-right">
                                                    {Number(item.taxAmount) > 0 ? (
                                                        <div className="flex flex-col text-[10px] leading-tight items-end">
                                                            <span>{gstRate}%</span>
                                                            <span className="text-gray-500">₹{Number(item.taxAmount).toFixed(2)}</span>
                                                        </div>
                                                    ) : "-"}
                                                </td>
                                            )}

                                            <td className="border border-black p-2 text-right font-bold">₹{Number(item.total).toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* --- FOOTER SECTION --- */}
                    <div className="flex justify-between mt-6 gap-8">

                        {/* LEFT: BANK & NOTES */}
                        <div className="w-[60%]">
                            {bank && (
                                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded text-xs">
                                    <h3 className="font-bold uppercase text-gray-700 mb-2 border-b border-gray-300 pb-1">Bank Details</h3>
                                    <div className="grid grid-cols-[100px_1fr] gap-y-1">
                                        <span className="text-gray-600">Account Name:</span>
                                        <span className="font-semibold">{bank.accountHolderName}</span>

                                        <span className="text-gray-600">Bank Name:</span>
                                        <span className="font-semibold">{bank.bankName}</span>

                                        <span className="text-gray-600">Account No:</span>
                                        <span className="font-semibold">{bank.accountNumber}</span>

                                        <span className="text-gray-600">IFSC Code:</span>
                                        <span className="font-semibold">{bank.ifscCode}</span>

                                        {bank.branchName && (
                                            <>
                                                <span className="text-gray-600">Branch:</span>
                                                <span className="font-semibold">{bank.branchName}</span>
                                            </>
                                        )}
                                        {bank.upiId && (
                                            <>
                                                <span className="text-gray-600">UPI ID:</span>
                                                <span className="font-semibold">{bank.upiId}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {invoice.notes && (
                                <div className="text-xs mt-4">
                                    <h3 className="font-bold uppercase text-gray-500 mb-1">Terms & Notes</h3>
                                    <p className="whitespace-pre-wrap text-gray-700">{invoice.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: TOTALS */}
                        <div className="w-[40%]">
                            <div className=" text-sm">
                                <div className="p-3 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span className="font-semibold">₹{Number(invoice.subTotal).toFixed(2)}</span>
                                    </div>

                                    {calculations.hasTax && (
                                        <>
                                            {!calculations.isInterState ? (
                                                <>
                                                    <div className="flex justify-between text-xs text-gray-600">
                                                        <span>CGST (Total / 2):</span>
                                                        <span>₹{(calculations.totalTaxAmount / 2).toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs text-gray-600">
                                                        <span>SGST (Total / 2):</span>
                                                        <span>₹{(calculations.totalTaxAmount / 2).toFixed(2)}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex justify-between text-xs text-gray-600">
                                                    <span>IGST (Total):</span>
                                                    <span>₹{calculations.totalTaxAmount.toFixed(2)}</span>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <div className="flex justify-between font-bold text-lg border-t border-black pt-2 mt-2">
                                        <span>Total Amount:</span>
                                        <span>₹{Number(invoice.totalAmount).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="bg-gray-100 border-t border-black p-3 text-sm">
                                    <div className="flex justify-between mb-1 text-green-700">
                                        <span className="font-semibold">Amount Paid:</span>
                                        <span className="font-bold">₹{calculations.totalPaid.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-red-700">
                                        <span className="font-semibold">Balance Due:</span>
                                        <span className="font-bold">₹{calculations.balance.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- SIGNATURES --- */}
                    <div className="flex justify-between mt-16 pt-8 align-bottom">
                        <div className="text-center w-1/3">
                            <div className="border-t border-black pt-1"></div>
                            <p className="text-xs font-bold text-gray-600">Receiver's Signature</p>
                        </div>
                        <div className="text-center w-1/3">
                            <div className="border-t border-black pt-1"></div>
                            <p className="text-xs font-bold text-gray-600">Authorized Signatory</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrintInvoicePage;
