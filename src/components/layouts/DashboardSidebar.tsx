"use client"
import { 
    FileTextIcon, 
    LayoutDashboard, 
    Package, 
    FileText, 
    Receipt, 
    Users,
    CreditCard,
    Wallet,
    BarChart3,
    Zap,
    Bot,
    UserCog,
    Settings,
    ChevronDown,
    DollarSign,
    TrendingUp
} from "lucide-react";
import { 
    SidebarContent, 
    SidebarFooter, 
    SidebarGroup, 
    SidebarGroupContent, 
    SidebarHeader, 
    SidebarMenu, 
    SidebarMenuButton, 
    SidebarMenuItem, 
    Sidebar,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import DashboardUserButton from "../DashboardUserButton";

function DashboardSidebar() {
    const pathname = usePathname();

    const mainFeatures = [
        {
            icon: LayoutDashboard,
            label: "Dashboard",
            href: "/user/dashboard",
        },
        {
            icon: FileText,
            label: "Invoices",
            href: "/user/invoices",
            subItems: [
                { label: "Create Invoice", href: "/user/invoices/create" },
                { label: "View All", href: "/user/invoices" },
                { label: "Draft Invoices", href: "/user/invoices/drafts" },
                { label: "Overdue", href: "/user/invoices/overdue" }
            ]
        },
        {
            icon: Users,
            label: "Customers",
            href: "/user/customers",
            subItems: [
                { label: "All Customers", href: "/user/customers" },
                { label: "Add Customer", href: "/user/customers/add" },
                { label: "Outstanding Balance", href: "/user/customers/outstanding" }
            ]
        },
        {
            icon: CreditCard,
            label: "Payments",
            href: "/user/payments",
            subItems: [
                { label: "All Transactions", href: "/user/payments" },
                { label: "Pending", href: "/user/payments/pending" },
                { label: "Completed", href: "/user/payments/completed" }
            ]
        },
        {
            icon: Wallet,
            label: "Expenses",
            href: "/user/expenses",
            subItems: [
                { label: "View Expenses", href: "/user/expenses" },
                { label: "Add Expense", href: "/user/expenses/add" },
                { label: "Categories", href: "/user/expenses/categories" }
            ]
        },
        {
            icon: BarChart3,
            label: "Analytics",
            href: "/user/analytics",
            subItems: [
                { label: "Overview", href: "/user/analytics" },
                { label: "Income Report", href: "/user/analytics/income" },
                { label: "Expense Report", href: "/user/analytics/expenses" },
                { label: "Profit & Loss", href: "/user/analytics/profit-loss" },
                { label: "Top Customers", href: "/user/analytics/customers" }
            ]
        },
        // {
        //     icon: Zap,
        //     label: "Automation",
        //     href: "/user/automation",
        //     subItems: [
        //         { label: "Reminders", href: "/user/automation/reminders" },
        //         { label: "Scheduled Emails", href: "/user/automation/emails" },
        //     ]
        // },
        {
            icon: Bot,
            label: "AI Insights",
            href: "/user/ai-insights",
        },
        {
            icon: Package,
            label: "Products",
            href: "/user/products",
        },
        {
            icon: Settings,
            label: "Settings",
            href: "/user/settings",
            
        }
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
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                const hasSubItems = item.subItems && item.subItems.length > 0;

                                if (hasSubItems) {
                                    return (
                                        <Collapsible
                                            key={idx}
                                            defaultOpen={isActive}
                                            className="group/collapsible"
                                        >
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        className={cn(
                                                            "h-11 px-3 rounded-xl transition-all duration-200",
                                                            "hover:bg-accent hover:text-accent-foreground",
                                                            isActive
                                                                ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent text-primary font-semibold shadow-sm border border-primary/20 dark:from-primary/20 dark:via-primary/10"
                                                                : "text-muted-foreground hover:shadow-sm"
                                                        )}
                                                    >
                                                        <item.icon className={cn(
                                                            "size-5 transition-all",
                                                            isActive ? "text-primary scale-110" : "text-muted-foreground"
                                                        )} />
                                                        <span className="text-sm flex-1">
                                                            {item.label}
                                                        </span>
                                                        <ChevronDown className={cn(
                                                            "size-4 transition-transform duration-200",
                                                            "group-data-[state=open]/collapsible:rotate-180"
                                                        )} />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub className="ml-4 mt-1 space-y-1">
                                                        {item.subItems.map((subItem, subIdx) => {
                                                            const isSubActive = pathname === subItem.href;
                                                            return (
                                                                <SidebarMenuSubItem key={subIdx}>
                                                                    <SidebarMenuSubButton
                                                                        asChild
                                                                        isActive={isSubActive}
                                                                        className={cn(
                                                                            "rounded-lg transition-all duration-200",
                                                                            isSubActive
                                                                                ? "bg-primary/10 text-primary font-medium"
                                                                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                                        )}
                                                                    >
                                                                        <Link href={subItem.href}>
                                                                            <span className="text-xs">
                                                                                {subItem.label}
                                                                            </span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            );
                                                        })}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    );
                                }

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
