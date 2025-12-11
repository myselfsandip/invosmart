"use client"

import { getCustomerColumns } from "@/app/user/customers/customer-columns"
import { CustomerFormDialog } from "@/components/customer/customer-form-dialog"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { useConfirm } from "@/hooks/useConfirm"
import { CustomerBaseType, CustomerCreateType } from "@/lib/validations/customer"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { PlusIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

const CustomersPage = () => {
    const trpc = useTRPC();
    const { data, refetch } = useQuery(trpc.customer.getAll.queryOptions());

    const createMutation = useMutation(trpc.customer.create.mutationOptions());
    const updateMutation = useMutation(trpc.customer.update.mutationOptions());
    const deleteMutation = useMutation(trpc.customer.delete.mutationOptions());

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerBaseType | null>(null);

    const { confirm, ConfirmDialog } = useConfirm();

    // Create handler
    const handleCreate = (data: CustomerCreateType) => {
        createMutation.mutate(data, {
            onSuccess: () => {
                toast.success("Customer added successfully");
                refetch();
            },
            onError: () => {
                toast.error("Failed to create customer");
            },
        });
    };

    // Edit handler - opens dialog
    const handleEdit = (customer: CustomerBaseType) => {
        setSelectedCustomer(customer);
        setEditDialogOpen(true);
    };

    // Update handler - submits form
    const handleUpdate = (data: CustomerCreateType) => {
        if (!selectedCustomer?.id) return;

        updateMutation.mutate(
            { customerId: selectedCustomer.id, ...data },
            {
                onSuccess: () => {
                    toast.success("Customer updated successfully");
                    setEditDialogOpen(false);
                    setSelectedCustomer(null);
                    refetch();
                },
                onError: () => {
                    toast.error("Failed to update customer");
                },
            }
        );
    };

    const handleDelete = async (customerId: string) => {
        const confirmed = await confirm({
            title: "Are you sure?",
            description: `The following action will remove this customer data`,
            confirmText: "Delete Customer",
            cancelText: "Cancel",
            variant: "destructive"
        })

        if (confirmed) {
            deleteMutation.mutate(
                { customerId },
                {
                    onSuccess: () => {
                        toast.success("Customer deleted successfully");
                        refetch();
                    },
                    onError: () => {
                        toast.error("Failed to delete customer");
                    },
                }
            );
        }
    };


    const columns = useMemo(() => getCustomerColumns(handleEdit, handleDelete), []);

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4">
                <h2 className="font-medium text-2xl">Customers</h2>
                <CustomerFormDialog
                    mode="create"
                    trigger={
                        <Button>
                            Add Customer <PlusIcon className="ml-2 size-4" />
                        </Button>
                    }
                    onSubmit={handleCreate}
                />
            </div>

            {/* Table */}
            <div className="px-4 mt-5">
                <DataTable
                    columns={columns}
                    data={data ?? []}
                />
            </div>

            {/* Edit Dialog */}
            {selectedCustomer && (
                <CustomerFormDialog
                    mode="edit"
                    initialData={selectedCustomer}
                    onSubmit={handleUpdate}
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                />
            )}

            {/* Confirm Dialog */}
            <ConfirmDialog />
        </div>
    );
};

export default CustomersPage;
