import { LoginForm } from "@/components/login-form";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (session) {
        redirect('/user')
    }
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <LoginForm />
            </div>
        </div>
    )
}
