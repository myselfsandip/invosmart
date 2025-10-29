import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAuth(redirectUrl: string = "/sign-in/user/") {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        redirect(redirectUrl);
    }
    return session;
}


export async function requireAdminAuth(redirectUrl: string = "/crm-admin/login") {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        redirect(redirectUrl);
    }
    if (session.user.role !== "admin") {
        redirect(redirectUrl);
    }
    return session;
}


