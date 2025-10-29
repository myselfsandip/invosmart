"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { authClient } from "@/server/auth/auth-client";
import { useQueryClient } from "@tanstack/react-query";

export function useLogout() {
    const [isPending, startTransition] = useTransition();
    const queryClient = useQueryClient();

    const logout = () => {
        startTransition(async () => {
            const response = await authClient.signOut();

            if (response.error) {
                toast.error(response.error.message || "Logout failed");
            } else {
                queryClient.clear(); //Clear Cache
                toast.success("Logged out successfully");
                window.location.href = '/login'; //using this instead of next/navigation to bypass login modal opening 
            }
        });
    };

    return { logout, isPending };
}
