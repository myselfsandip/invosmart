"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessInfoForm } from "@/components/settings/business-info-form";
import { BankDetailsForm } from "@/components/settings/bank-details-form";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { BusinessInfoType, BankDetailsType } from "@/lib/validations/user";
import { useConfirm } from "@/hooks/useConfirm";

const SettingsPage = () => {
    const trpc = useTRPC();

    // Queries
    const { data: businessInfo, refetch: refetchBusiness } = useQuery(
        trpc.user.getBusinessInfo.queryOptions()
    );
    const { data: bankDetails, refetch: refetchBank } = useQuery(
        trpc.user.getBankDetails.queryOptions()
    );

    // Mutations
    const upsertBusinessMutation = useMutation(trpc.user.upsertBusinessInfo.mutationOptions());
    const upsertBankMutation = useMutation(trpc.user.upsertBankDetails.mutationOptions());
    const deleteBankMutation = useMutation(trpc.user.deleteBankDetails.mutationOptions());

    const { confirm, ConfirmDialog } = useConfirm();

    // Handlers
    const handleBusinessSubmit = (data: BusinessInfoType) => {
        upsertBusinessMutation.mutate(data, {
            onSuccess: () => {
                toast.success("Business info saved successfully");
                refetchBusiness();
            },
            onError: () => {
                toast.error("Failed to save business info");
            },
        });
    };

    const handleBankSubmit = (data: BankDetailsType) => {
        upsertBankMutation.mutate(data, {
            onSuccess: () => {
                toast.success("Bank details saved successfully");
                refetchBank();
            },
            onError: () => {
                toast.error("Failed to save bank details");
            },
        });
    };

    const handleBankDelete = async () => {
        const confirmed = await confirm({
            title: "Delete Bank Details?",
            description: "This will remove all your bank details. This action cannot be undone.",
            confirmText: "Delete",
            cancelText: "Cancel",
            variant: "destructive",
        });

        if (confirmed) {
            deleteBankMutation.mutate(undefined, {
                onSuccess: () => {
                    toast.success("Bank details deleted successfully");
                    refetchBank();
                },
                onError: () => {
                    toast.error("Failed to delete bank details");
                },
            });
        }
    };

    return (
        <div className="w-full py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your information
                </p>
            </div>

            <Tabs defaultValue="business" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="business">Business Info</TabsTrigger>
                    <TabsTrigger value="bank">Bank Details</TabsTrigger>
                </TabsList>

                <TabsContent value="business" className="mt-6">
                    <div className="rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">Business Information</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            This information will appear on your invoices
                        </p>
                        <BusinessInfoForm
                            initialData={businessInfo}
                            onSubmit={handleBusinessSubmit}
                            isLoading={upsertBusinessMutation.isPending}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="bank" className="mt-6">
                    <div className="rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Add your bank account details for payment information on invoices
                        </p>
                        <BankDetailsForm
                            initialData={bankDetails}
                            onSubmit={handleBankSubmit}
                            onDelete={bankDetails ? handleBankDelete : undefined}
                            isLoading={upsertBankMutation.isPending || deleteBankMutation.isPending}
                        />
                    </div>
                </TabsContent>
            </Tabs>

            <ConfirmDialog />
        </div>
    );
};

export default SettingsPage;
