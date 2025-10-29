import { SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import { cn } from "@/lib/utils";


interface Props {
    children: ReactNode;
}


function DashboardLayout({ children }: Props) {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <main className="flex flex-col w-screen bg-gradient-to-br from-background via-muted/20 to-background">
                <DashboardNavbar />
                <div className="px-4 py-2 min-h-screen">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
}


export default DashboardLayout;
