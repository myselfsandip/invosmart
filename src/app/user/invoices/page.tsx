"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/useConfirm";
import { getInvoiceColumns, type InvoiceColumnType } from "./invoice-columns";
import { PaymentDialog } from "@/components/invoice/payment-dialog";

const InvoicesPage = () => {
  const trpc = useTRPC();
  const { confirm, ConfirmDialog } = useConfirm();

  const { data: invoices, refetch, isLoading } = useQuery(
    trpc.invoices.getAll.queryOptions()
  );

  const deleteMutation = useMutation(trpc.invoices.delete.mutationOptions());

  const [paymentInvoice, setPaymentInvoice] = useState<InvoiceColumnType | null>(null);

  const handlePrint = (invoiceId: string) => {
    window.open(`/user/invoices/${invoiceId}/print`, '_blank');
  };

  const handlePaymentClick = (invoice: InvoiceColumnType) => {
    setPaymentInvoice(invoice);
  };

  const handleDelete = async (invoiceId: string) => {
    const confirmed = await confirm({
      title: "Delete Invoice?",
      description: "This will permanently delete the invoice and all related data.",
      confirmText: "Delete",
      variant: "destructive"
    });

    if (confirmed) {
      deleteMutation.mutate({ invoiceId }, {
        onSuccess: () => {
          toast.success("Invoice deleted successfully");
          refetch();
        },
        onError: (err: any) => toast.error(err.message || "Failed to delete")
      });
    }
  };

  const columns = useMemo(
    () => getInvoiceColumns(handlePrint, handlePaymentClick, handleDelete),
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-4 py-4">
        <div>
          <h2 className="font-medium text-2xl">Invoices</h2>
          <p className="text-muted-foreground text-sm">Manage and track all your invoices</p>
        </div>
        <Button asChild>
          <Link href="/user/invoices/create">
            <PlusIcon className="mr-2 h-4 w-4" /> Create Invoice
          </Link>
        </Button>
      </div>

      <div className="px-4 mt-5">
        <DataTable
          columns={columns}
          data={invoices ?? []}
          isLoading={isLoading}
          filterKey="invoiceNumber"
        />
      </div>

      <ConfirmDialog />

      {paymentInvoice && (
        <PaymentDialog
          invoice={paymentInvoice}
          open={!!paymentInvoice}
          onOpenChange={(isOpen) => !isOpen && setPaymentInvoice(null)}
          onSuccess={() => {
            refetch();
            setPaymentInvoice(null);
          }}
        />
      )}
    </div>
  );
};

export default InvoicesPage;
