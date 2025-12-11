"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTRPC } from "@/trpc/client";

const formatDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
};

const PrintReceiptPage = () => {
    const params = useParams();
    const paymentId = params.id as string;
    const trpc = useTRPC();

    const { data: receipt, isLoading } = useQuery(
        trpc.payments.getReceipt.queryOptions({ paymentId })
    );

    useEffect(() => {
        if (receipt && !isLoading) {
            setTimeout(() => window.print(), 500);
        }
    }, [receipt, isLoading]);

    if (isLoading) {
        return <div className="p-8 text-center">Loading receipt...</div>;
    }

    if (!receipt) {
        return (
            <div className="p-8 text-center text-red-500">
                Receipt not found
            </div>
        );
    }

    return (
        <>
            <div className="print-receipt-wrapper">
                <div className="receipt-page">
                    <div className="receipt-header-border"></div>

                    <header className="receipt-header">
                        <h1 className="receipt-title">PAYMENT RECEIPT</h1>
                        <div className="receipt-meta">
                            <div className="receipt-number">
                                Receipt No: <strong>{receipt.id.slice(-8).toUpperCase()}</strong>
                            </div>
                            <div className="receipt-date">
                                Date: <strong>{formatDate(receipt.paymentDate)}</strong>
                            </div>
                        </div>
                    </header>

                    {(receipt.business?.name || receipt.business?.address || receipt.business?.email || receipt.business?.phone) && (
                        <section className="business-section">
                            {receipt.business?.name && (
                                <div className="business-name">{receipt.business.name}</div>
                            )}
                            {receipt.business?.address && (
                                <div className="business-detail">{receipt.business.address}</div>
                            )}
                            <div className="business-contact">
                                {receipt.business?.email && <span>{receipt.business.email}</span>}
                                {receipt.business?.email && receipt.business?.phone && <span className="separator">•</span>}
                                {receipt.business?.phone && <span>{receipt.business.phone}</span>}
                            </div>
                        </section>
                    )}

                    <div className="divider"></div>

                    <section className="receipt-details">
                        <div className="detail-row">
                            <span className="detail-label">Received From</span>
                            <span className="detail-value">{receipt.customer?.name || "Customer"}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Invoice Number</span>
                            <span className="detail-value invoice-number">#{receipt.invoiceNumber}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Payment Method</span>
                            <span className="detail-value payment-method">
                                {receipt.paymentMethod.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                        </div>
                        {receipt.transactionId && (
                            <div className="detail-row">
                                <span className="detail-label">Transaction Reference</span>
                                <span className="detail-value transaction-ref">{receipt.transactionId}</span>
                            </div>
                        )}
                    </section>

                    <div className="divider"></div>

                    <section className="amount-section">
                        <div className="amount-label">Amount Received</div>
                        <div className="amount-value">₹{Number(receipt.amountPaid).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div className="amount-words">
                            {convertToWords(Number(receipt.amountPaid))}
                        </div>
                    </section>

                    {receipt.notes && (
                        <>
                            <div className="divider"></div>
                            <section className="notes-section">
                                <div className="notes-label">Notes:</div>
                                <div className="notes-content">{receipt.notes}</div>
                            </section>
                        </>
                    )}

                    <section className="signature-section">
                        <div className="signature-box">
                            <div className="signature-line"></div>
                            <div className="signature-label">Authorized Signature</div>
                            {receipt.business?.name && (
                                <div className="signature-business">{receipt.business.name}</div>
                            )}
                        </div>
                    </section>

                    <footer className="receipt-footer">
                        <div className="footer-message">Thank you for your payment</div>
                        <div className="footer-note">This is a computer-generated receipt and does not require a physical signature</div>
                    </footer>
                </div>
            </div>

            <style jsx global>{`
                /* SCREEN STYLES */
                @media screen {
                    .print-receipt-wrapper {
                        display: flex;
                        justify-content: center;
                        align-items: flex-start;
                        min-height: 100vh;
                        background: #e5e7eb;
                        padding: 20px;
                    }
                    .receipt-page {
                        width: 100%;
                        max-width: 800px;
                        background: white;
                        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                        padding: 48px 56px;
                    }
                }

                /* PRINT STYLES - COMPACT MODE */
                @media print {
                    @page { margin: 0; size: auto; }
                    
                    body, html {
                        visibility: hidden;
                        height: 100%;
                        margin: 0 !important;
                        padding: 0 !important;
                    }

                    .print-receipt-wrapper {
                        visibility: visible;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white;
                    }

                    .print-receipt-wrapper * { visibility: visible; }

                    .receipt-page {
                        width: 100%;
                        padding: 10mm 15mm !important; /* Reduced padding */
                        box-shadow: none;
                        background: white;
                    }
                    
                    /* Force everything to fit */
                    .receipt-header { margin-bottom: 20px !important; }
                    .business-section { margin-bottom: 20px !important; }
                    .amount-section { margin: 20px 0 !important; padding: 15px !important; }
                    .signature-section { margin-top: 40px !important; margin-bottom: 20px !important; }
                    .divider { margin: 15px 0 !important; }
                    .receipt-footer { padding-top: 15px !important; }
                    
                    /* Adjust font sizes for print */
                    .receipt-title { font-size: 24px !important; margin-bottom: 10px !important; }
                    .amount-value { font-size: 30px !important; }
                    
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }

                /* SHARED STYLES */
                .receipt-page { color: #1f2937; line-height: 1.5; font-family: sans-serif; }
                
                .receipt-header-border { height: 4px; background: linear-gradient(to right, #3b82f6, #8b5cf6); margin-bottom: 24px; }
                .receipt-header { text-align: center; margin-bottom: 32px; }
                .receipt-title { font-size: 28px; font-weight: 700; letter-spacing: 2px; color: #111827; margin-bottom: 12px; }
                
                .receipt-meta { display: flex; justify-content: center; gap: 32px; font-size: 13px; color: #6b7280; }
                .receipt-number strong, .receipt-date strong { color: #374151; font-weight: 600; }
                
                .business-section { text-align: center; margin-bottom: 32px; }
                .business-name { font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 4px; }
                .business-detail, .business-contact { font-size: 13px; color: #6b7280; }
                .business-contact .separator { margin: 0 8px; }

                .divider { height: 1px; background: #e5e7eb; margin: 24px 0; }

                .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
                .detail-label { font-size: 14px; color: #6b7280; font-weight: 500; }
                .detail-value { font-size: 14px; color: #111827; font-weight: 600; text-align: right; }
                .invoice-number { font-family: monospace; background: #f9fafb; padding: 2px 8px; border-radius: 4px; }

                .amount-section { background: #f0f9ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 24px; text-align: center; margin: 32px 0; }
                .amount-label { font-size: 14px; color: #1e40af; font-weight: 600; text-transform: uppercase; margin-bottom: 4px; }
                .amount-value { font-size: 36px; font-weight: 700; color: #1e40af; margin-bottom: 4px; }
                .amount-words { font-size: 13px; color: #3b82f6; font-style: italic; }

                .notes-section { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; margin: 20px 0; }
                .notes-label { font-size: 12px; color: #92400e; font-weight: 600; text-transform: uppercase; margin-bottom: 4px; }
                .notes-content { font-size: 13px; color: #78350f; }

                .signature-section { margin-top: 50px; margin-bottom: 20px; display: flex; justify-content: flex-end; }
                .signature-box { text-align: center; min-width: 200px; }
                .signature-line { height: 50px; position: relative; margin-bottom: 8px; }
                .signature-line::after { content: ""; width: 100%; height: 1px; background: #374151; position: absolute; bottom: 0; left: 0; }
                .signature-label { font-size: 12px; font-weight: 600; }
                .signature-business { font-size: 11px; color: #6b7280; }

                .receipt-footer { text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb; }
                .footer-message { font-size: 14px; font-weight: 500; margin-bottom: 4px; }
                .footer-note { font-size: 10px; color: #9ca3af; }
            `}</style>
        </>
    );
};

function convertToWords(amount: number): string {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (amount === 0) return 'Zero Rupees Only';

    let num = Math.floor(amount);
    const decimals = Math.round((amount - num) * 100);
    let words = '';

    if (num >= 10000000) { words += convertToWords(Math.floor(num / 10000000)) + ' Crore '; num %= 10000000; }
    if (num >= 100000) { words += convertToWords(Math.floor(num / 100000)) + ' Lakh '; num %= 100000; }
    if (num >= 1000) { words += convertToWords(Math.floor(num / 1000)) + ' Thousand '; num %= 1000; }
    if (num >= 100) { words += ones[Math.floor(num / 100)] + ' Hundred '; num %= 100; }
    if (num >= 20) { words += tens[Math.floor(num / 10)] + ' '; num %= 10; }
    if (num >= 10) { words += teens[num - 10] + ' '; num = 0; }
    if (num > 0) { words += ones[num] + ' '; }

    words = words.trim() + ' Rupees';
    if (decimals > 0) { words += ' and ' + decimals + ' Paise'; }
    return words + ' Only';
}

export default PrintReceiptPage;
