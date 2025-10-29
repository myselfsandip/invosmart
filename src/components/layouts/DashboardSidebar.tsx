"use client"
import {  FileTextIcon,  LayoutDashboard, Package, FileText, Receipt, Users } from "lucide-react";
import { SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, Sidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import DashboardUserButton from "../dashboard/DashboardUserButton";


function DashboardSidebar() {
    const pathname = usePathname();


    const mainFeatures = [
        {
            icon: LayoutDashboard,
            label: "Dashboard",
            href: "/user/dashboard",
        },
        {
            icon: Package,
            label: "Products",
            href: "/user/products",
        },
        {
            icon: FileText,
            label: "Invoices",
            href: "/user/invoices",
        },
        {
            icon: Receipt,
            label: "Payment Receipts",
            href: "/user/payment-receipts",
        },
        {
            icon: Users,
            label: "Customers",
            href: "/user/customers",
        },
    ];


    return (
        <Sidebar className={cn(
            "border-r",
            "border-border/40",
            "bg-gradient-to-b from-background to-muted/20"
        )}>
            <SidebarHeader className="border-b border-border/40 py-4 px-2 bg-background/50 backdrop-blur-sm">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2 group hover:bg-accent/50 transition-all rounded-xl"
                >
                    <div className="w-9 h-9 bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 group-hover:scale-105 transition-all">
                        <FileTextIcon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                            InvoSmart
                        </span>
                        <span className="text-xs text-muted-foreground font-medium -mt-0.5">
                            Payment Suite
                        </span>
                    </div>
                </Link>
            </SidebarHeader>


            <SidebarContent className="px-3 py-4">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1.5">
                            {mainFeatures.map((item, idx) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href);
                                return (
                                    <SidebarMenuItem key={idx}>
                                        <SidebarMenuButton
                                            asChild
                                            className={cn(
                                                "h-11 px-3 rounded-xl transition-all duration-200",
                                                "hover:bg-accent hover:text-accent-foreground hover:translate-x-0.5",
                                                isActive
                                                    ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent text-primary font-semibold shadow-sm border border-primary/20 dark:from-primary/20 dark:via-primary/10"
                                                    : "text-muted-foreground hover:shadow-sm"
                                            )}
                                        >
                                            <Link href={item.href}>
                                                <item.icon className={cn(
                                                    "size-5 transition-all",
                                                    isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:scale-105"
                                                )} />
                                                <span className="text-sm">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>


            <SidebarFooter className="">
                <DashboardUserButton />
            </SidebarFooter>
        </Sidebar>
    );
}


export default DashboardSidebar;
