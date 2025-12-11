"use client"

import { ColumnDef } from "@tanstack/react-table";
import { CustomerBaseType } from "@/lib/validations/customer";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pen, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const getCustomerColumns = (
    onEdit: (customer: CustomerBaseType) => void,
    onDelete: (customerId: string) => void
): ColumnDef<CustomerBaseType>[] => [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "phone",
            header: "Phone",
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => row.original.email || "—",
        },
        {
            accessorKey: "gstNo",
            header: "GST Number",
            cell: ({ row }) => row.original.gstNo || "—",
        },
        {
            accessorKey: "address",
            header: "Address",
        },
        {
            accessorKey: "pin",
            header: "PIN",
        },
        {
            accessorKey: "state",
            header: "State",
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const customer = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(customer)}>
                                <Pen className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(customer.id)}
                                className="text-red-600 focus:text-red-600"
                            >
                                <Trash className="mr-2 h-4 w-4 text-red-500" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
