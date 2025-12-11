"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TrendingUpIcon, TrendingDownIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";


function DefaultCardAction({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("absolute right-6 top-6", className)}>{children}</div>;
}

export function SectionCards() {
    const trpc = useTRPC();
    const { data, isLoading } = useQuery(trpc.dashboard.getStats.queryOptions());

    if (isLoading) {
        return <CardsSkeleton />;
    }

    const { revenue, totalCustomers, pendingInvoicesCount, pendingInvoicesValue } = data || {};


    return (
        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

            {/* CARD 1: TOTAL REVENUE */}
            <Card className={cn(
                "@container/card relative",
                "bg-gradient-to-br from-background via-background to-primary/5",
                "border-border/40 shadow-lg hover:shadow-xl transition-all duration-300",
                "hover:scale-[1.02] hover:-translate-y-1",
                "dark:from-card dark:to-card"
            )}>
                <CardHeader>
                    <CardDescription className="text-muted-foreground font-medium">Total Revenue</CardDescription>
                    <CardTitle className="text-3xl font-bold tabular-nums bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text @[250px]/card:text-4xl">
                        ₹{revenue?.toLocaleString('en-IN') ?? 0}
                    </CardTitle>
                    <div className="absolute right-6 top-6">
                        <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400 font-semibold">
                            <TrendingUpIcon className="size-3.5 mr-1" />
                            Active
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm pt-4 border-t border-border/20">
                    <div className="line-clamp-1 flex gap-2 font-semibold text-green-700 dark:text-green-400">
                        Lifetime Earnings <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground text-xs">
                        Total collected payments
                    </div>
                </CardFooter>
            </Card>

            {/* CARD 2: NEW CUSTOMERS */}
            <Card className={cn(
                "@container/card relative",
                "bg-gradient-to-br from-background via-background to-blue-500/5",
                "border-border/40 shadow-lg hover:shadow-xl transition-all duration-300",
                "hover:scale-[1.02] hover:-translate-y-1",
                "dark:from-card dark:to-card"
            )}>
                <CardHeader>
                    <CardDescription className="text-muted-foreground font-medium">Total Customers</CardDescription>
                    <CardTitle className="text-3xl font-bold tabular-nums bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text @[250px]/card:text-4xl">
                        {totalCustomers ?? 0}
                    </CardTitle>
                    <div className="absolute right-6 top-6">
                        <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400 font-semibold">
                            <TrendingUpIcon className="size-3.5 mr-1" />
                            Growing
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm pt-4 border-t border-border/20">
                    <div className="line-clamp-1 flex gap-2 font-semibold text-blue-700 dark:text-blue-400">
                        Active Client Base <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground text-xs">
                        Total registered clients
                    </div>
                </CardFooter>
            </Card>

            {/* CARD 3: PENDING INVOICES (COUNT) */}
            <Card className={cn(
                "@container/card relative",
                "bg-gradient-to-br from-background via-background to-purple-500/5",
                "border-border/40 shadow-lg hover:shadow-xl transition-all duration-300",
                "hover:scale-[1.02] hover:-translate-y-1",
                "dark:from-card dark:to-card"
            )}>
                <CardHeader>
                    <CardDescription className="text-muted-foreground font-medium">Pending Invoices</CardDescription>
                    <CardTitle className="text-3xl font-bold tabular-nums bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text @[250px]/card:text-4xl">
                        {pendingInvoicesCount ?? 0}
                    </CardTitle>
                    <div className="absolute right-6 top-6">
                        <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-400 font-semibold">
                            Unpaid
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm pt-4 border-t border-border/20">
                    <div className="line-clamp-1 flex gap-2 font-semibold text-purple-700 dark:text-purple-400">
                        Awaiting Payment <AlertCircle className="size-4" />
                    </div>
                    <div className="text-muted-foreground text-xs">
                        Invoices marked as 'Due'
                    </div>
                </CardFooter>
            </Card>

            {/* CARD 4: PENDING VALUE (Future Cashflow) */}
            <Card className={cn(
                "@container/card relative",
                "bg-gradient-to-br from-background via-background to-amber-500/5",
                "border-border/40 shadow-lg hover:shadow-xl transition-all duration-300",
                "hover:scale-[1.02] hover:-translate-y-1",
                "dark:from-card dark:to-card"
            )}>
                <CardHeader>
                    <CardDescription className="text-muted-foreground font-medium">Pending Amount</CardDescription>
                    <CardTitle className="text-3xl font-bold tabular-nums bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text @[250px]/card:text-4xl">
                        ₹{pendingInvoicesValue?.toLocaleString('en-IN') ?? 0}
                    </CardTitle>
                    <div className="absolute right-6 top-6">
                        <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold">
                            <TrendingUpIcon className="size-3.5 mr-1" />
                            Future
                        </Badge>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm pt-4 border-t border-border/20">
                    <div className="line-clamp-1 flex gap-2 font-semibold text-amber-700 dark:text-amber-400">
                        Projected Revenue <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground text-xs">
                        Total value of unpaid invoices
                    </div>
                </CardFooter>
            </Card>

        </div>
    );
}

function CardsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
            ))}
        </div>
    );
}
