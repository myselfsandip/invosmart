import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"


export function SectionCards() {
    return (
        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className={cn(
                "@container/card",
                "bg-gradient-to-br from-background via-background to-primary/5",
                "border-border/40 shadow-lg hover:shadow-xl transition-all duration-300",
                "hover:scale-[1.02] hover:-translate-y-1",
                "dark:from-card dark:to-card"
            )}>
                <CardHeader>
                    <CardDescription className="text-muted-foreground font-medium">Total Revenue</CardDescription>
                    <CardTitle className="text-3xl font-bold tabular-nums bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text @[250px]/card:text-4xl">
                        $1,250.00
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400 font-semibold">
                            <TrendingUpIcon className="size-3.5" />
                            +12.5%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm pt-4 border-t border-border/20">
                    <div className="line-clamp-1 flex gap-2 font-semibold text-green-700 dark:text-green-400">
                        Trending up this month <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground text-xs">
                        Visitors for the last 6 months
                    </div>
                </CardFooter>
            </Card>

            <Card className={cn(
                "@container/card",
                "bg-gradient-to-br from-background via-background to-blue-500/5",
                "border-border/40 shadow-lg hover:shadow-xl transition-all duration-300",
                "hover:scale-[1.02] hover:-translate-y-1",
                "dark:from-card dark:to-card"
            )}>
                <CardHeader>
                    <CardDescription className="text-muted-foreground font-medium">New Customers</CardDescription>
                    <CardTitle className="text-3xl font-bold tabular-nums bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text @[250px]/card:text-4xl">
                        1,234
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400 font-semibold">
                            <TrendingDownIcon className="size-3.5" />
                            -20%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm pt-4 border-t border-border/20">
                    <div className="line-clamp-1 flex gap-2 font-semibold text-red-700 dark:text-red-400">
                        Down 20% this period <TrendingDownIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground text-xs">
                        Acquisition needs attention
                    </div>
                </CardFooter>
            </Card>

            <Card className={cn(
                "@container/card",
                "bg-gradient-to-br from-background via-background to-purple-500/5",
                "border-border/40 shadow-lg hover:shadow-xl transition-all duration-300",
                "hover:scale-[1.02] hover:-translate-y-1",
                "dark:from-card dark:to-card"
            )}>
                <CardHeader>
                    <CardDescription className="text-muted-foreground font-medium">Total Profit</CardDescription>
                    <CardTitle className="text-3xl font-bold tabular-nums bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text @[250px]/card:text-4xl">
                        45,678
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400 font-semibold">
                            <TrendingUpIcon className="size-3.5" />
                            +12.5%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm pt-4 border-t border-border/20">
                    <div className="line-clamp-1 flex gap-2 font-semibold text-green-700 dark:text-green-400">
                        Strong user retention <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground text-xs">Engagement exceed targets</div>
                </CardFooter>
            </Card>

            <Card className={cn(
                "@container/card",
                "bg-gradient-to-br from-background via-background to-amber-500/5",
                "border-border/40 shadow-lg hover:shadow-xl transition-all duration-300",
                "hover:scale-[1.02] hover:-translate-y-1",
                "dark:from-card dark:to-card"
            )}>
                <CardHeader>
                    <CardDescription className="text-muted-foreground font-medium">Pending Invoice</CardDescription>
                    <CardTitle className="text-3xl font-bold tabular-nums bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text @[250px]/card:text-4xl">
                        4.5%
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400 font-semibold">
                            <TrendingUpIcon className="size-3.5" />
                            +4.5%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm pt-4 border-t border-border/20">
                    <div className="line-clamp-1 flex gap-2 font-semibold text-green-700 dark:text-green-400">
                        Steady performance increase <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground text-xs">Meets growth projections</div>
                </CardFooter>
            </Card>
        </div>
    )
}
