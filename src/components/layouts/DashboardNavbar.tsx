"use client"

import DashboardCommand from "../DashboardCommand";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { LogOutIcon, PanelLeftCloseIcon, PanelLeftIcon, SettingsIcon, UserIcon } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLogout } from "@/hooks/use-logout";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";


function DashboardNavbar() {
    const { state, toggleSidebar, isMobile } = useSidebar();
    const [commandOpen, setCommandOpen] = useState(false);

    const router = useRouter();


    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setCommandOpen((open) => !open);
            }
        }


        document.addEventListener('keydown', down);
        return () => document.removeEventListener("keydown", down);
    }, [])


    const { logout } = useLogout();


    return (
        <>
            <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
            <nav className={cn(
                "flex justify-between px-4 gap-x-2 items-center py-3",
                "border-b border-border/40",
                "bg-background/80 backdrop-blur-md",
                "shadow-sm"
            )}>
                <div>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-9 hover:bg-accent hover:scale-105 transition-all shadow-sm border-border/40"
                        onClick={toggleSidebar}
                    >
                        {(state === 'collapsed' || isMobile) ? <PanelLeftIcon className="size-4" /> : <PanelLeftCloseIcon className="size-4" />}
                    </Button>
                </div>
                <div className="pr-1 flex gap-3 items-center">
                    <ModeToggle />
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="hover:bg-accent hover:scale-105 transition-all shadow-sm border-border/40"
                                >
                                    <UserIcon className="size-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                {/* <DropdownMenuItem onClick={() => { }} className="cursor-pointer">
                                    <UserIcon /> Profile
                                </DropdownMenuItem> */}
                                <DropdownMenuItem onClick={() => router.push('/user/settings')} className="cursor-pointer">
                                    <SettingsIcon /> Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                                    <LogOutIcon /> Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </nav>
        </>
    );
}


export default DashboardNavbar;
