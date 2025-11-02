"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/use-logout";
import { ChevronsUpDownIcon, CreditCard, Loader2, LogOut, Sparkles, User } from "lucide-react";
import { useRouter } from "next/navigation";
import GeneratedAvatar from "./GeneratedAvatar";
import { authClient } from "@/server/auth/auth-client";
import { cn } from "@/lib/utils";


function DashboardUserButton() {
    const { logout } = useLogout();

    const { data, isPending } = authClient.useSession();

    if (isPending) {
        return (
            <div className="rounded-xl border border-border/40 p-3 w-full flex items-center justify-center bg-gradient-to-r from-muted/30 to-muted/10 h-[60px]">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const user = data?.user;

    const handleBilling = () => {
        console.log('Navigate to billing');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={cn(
                    "rounded-xl border border-border/40 p-3 w-full",
                    "flex items-center justify-between",
                    "bg-gradient-to-r from-muted/30 to-muted/10",
                    "hover:from-muted/40 hover:to-muted/20",
                    "hover:shadow-md hover:scale-[1.02]",
                    "transition-all duration-200",
                    "overflow-hidden group",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                )}
            >
                {user ? (
                    <div className="relative ">
                        <GeneratedAvatar
                            seed={user.name as string}
                            variant="botttsNeutral"
                            className="size-9 mr-3 ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all"
                        />

                    </div>
                ) : null}

                <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate w-full group-hover:text-primary transition-colors">
                        {user?.name}
                    </p>
                    <p className="text-xs truncate w-full text-muted-foreground">
                        {user?.email}
                    </p>
                </div>
                <ChevronsUpDownIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                side="right"
                className={cn(
                    "w-72 p-2",
                    "bg-background/95 backdrop-blur-md",
                    "border-border/40 shadow-xl",
                    "animate-in fade-in-0 zoom-in-95"
                )}
            >
                <DropdownMenuLabel className="p-3 rounded-lg bg-gradient-to-br from-muted/50 to-muted/20">
                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="relative">
                                <GeneratedAvatar
                                    seed={user.name as string}
                                    variant="botttsNeutral"
                                    className="size-12 ring-2 ring-primary/20 shadow-sm"
                                />
                                <div className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-green-500 rounded-full border-2 border-background shadow-sm" />
                            </div>
                        ) : null}
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                            <span className="font-semibold text-sm truncate">{user?.name}</span>
                            <span className="font-normal text-xs text-muted-foreground truncate">{user?.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="my-2 bg-border/40" />

                <DropdownMenuItem
                    className={cn(
                        "cursor-pointer flex items-center justify-between",
                        "rounded-lg px-3 py-2.5 my-0.5",
                        "hover:bg-accent/50",
                        "transition-all duration-200",
                        "group/item"
                    )}
                    onClick={() => console.log('Profile')}
                >
                    <span className="flex items-center gap-3 text-sm font-medium">
                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">
                            <User className="size-4 text-primary" />
                        </div>
                        Profile Settings
                    </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className={cn(
                        "cursor-pointer flex items-center justify-between",
                        "rounded-lg px-3 py-2.5 my-0.5",
                        "hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-400",
                        "transition-all duration-200",
                        "group/item",
                        "border border-transparent hover:border-amber-500/20"
                    )}
                    onClick={handleBilling}
                >
                    <span className="flex items-center gap-3 text-sm font-medium">
                        <div className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover/item:bg-amber-500/20 transition-colors">
                            <CreditCard className="size-4 text-amber-600 dark:text-amber-500" />
                        </div>
                        Billing & Plans
                    </span>
                    <Sparkles className="size-3.5 text-amber-500" />
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-2 bg-border/40" />

                <DropdownMenuItem
                    className={cn(
                        "cursor-pointer flex items-center justify-between",
                        "rounded-lg px-3 py-2.5 my-0.5",
                        "hover:bg-destructive/10 hover:text-destructive",
                        "transition-all duration-200",
                        "group/item"
                    )}
                    onClick={logout}
                >
                    <span className="flex items-center gap-3 text-sm font-medium">
                        <div className="size-8 rounded-lg bg-destructive/10 flex items-center justify-center group-hover/item:bg-destructive/20 transition-colors">
                            <LogOut className="size-4 text-destructive" />
                        </div>
                        Logout
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default DashboardUserButton;
