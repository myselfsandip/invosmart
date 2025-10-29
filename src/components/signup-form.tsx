"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { EyeClosedIcon, EyeIcon, Github, OctagonAlertIcon } from "lucide-react"
import { useState, useTransition } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { useForm } from "react-hook-form"
import { SignupFormData, signupSchema } from "@/lib/validations/auth";
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from "next/navigation"
import { Alert, AlertTitle } from "./ui/alert"
import { authClient } from "@/server/auth/auth-client"

export function SignupForm({
    isModal = false,
    className,
    ...props
}: {
    isModal?: boolean;
    className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {

    const router = useRouter();
    const [ispending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);





    const form = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    });

    const onsubmit = (data: SignupFormData) => {
        startTransition(async () => {
            setError(null);
            try {
                await authClient.signUp.email({
                    ...data,
                })
                router.push("/user");
            } catch (error: any) {
                setError(error.message || "An unexpected error occurred");
            }
        });
    }

    const handleSocialLogin = {
        githubLogin: () => {
            authClient.signIn.social({
                provider: 'github',
                callbackURL: "/user"
            })
        },
        googleLogin: () => {
            authClient.signIn.social({
                provider: "google",
                callbackURL: "/user"
            })
        }
    }


    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-6xl">
                <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid p-0 md:grid-cols-2">
                            <Form
                                {...form}
                            >
                                <form onSubmit={form.handleSubmit(onsubmit)} className="p-6 md:p-8">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex flex-col items-center text-center">
                                            <h1 className="text-2xl font-bold">Welcome</h1>
                                            <p className="text-muted-foreground text-balance">
                                                Create a new Account
                                            </p>
                                        </div>
                                        <div className="grid gap-3">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="text"
                                                                placeholder="John Doe"
                                                                disabled={ispending}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid gap-3">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="email"
                                                                placeholder="m@example.com"
                                                                disabled={ispending}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid gap-3">
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="flex items-center">
                                                            <FormLabel>Password</FormLabel>
                                                            <a
                                                                href="forgot-password"
                                                                className="ml-auto text-sm underline-offset-2 hover:underline"
                                                            >
                                                                Forgot your password?
                                                            </a>
                                                        </div>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    type={showPassword ? "text" : "password"}
                                                                    placeholder="Enter Password"
                                                                    disabled={ispending}
                                                                    {...field}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                                >
                                                                    {showPassword ? (
                                                                        <EyeIcon className="size-4" aria-hidden="true" />
                                                                    ) : (
                                                                        <EyeClosedIcon className="size-4" aria-hidden="true" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <FormField
                                                control={form.control}
                                                name="confirmPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="flex items-center">
                                                            <FormLabel>Confirm Password</FormLabel>
                                                        </div>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    type={showConfirmPassword ? "text" : "password"}
                                                                    placeholder="Enter Confirm Password"
                                                                    disabled={ispending}
                                                                    {...field}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                                    onClick={() => setShowConfirmPassword((prev) => !prev)}

                                                                >
                                                                    {showConfirmPassword ? (
                                                                        <EyeIcon className="size-4" aria-hidden="true" />
                                                                    ) : (
                                                                        <EyeClosedIcon className="size-4" aria-hidden="true" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>



                                        {!!error && (
                                            <Alert className="bg-destructive/10 border-none">
                                                <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                                                <AlertTitle>{error}</AlertTitle>
                                            </Alert>
                                        )}


                                        <Button disabled={ispending} type="submit" className="w-full">
                                            Sign Up
                                        </Button>
                                        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                            <span className="bg-card text-muted-foreground relative z-10 px-2">
                                                Or continue with
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">

                                            <Button
                                                disabled={ispending}
                                                onClick={handleSocialLogin.googleLogin}
                                                variant="outline" type="button" className="w-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                    <path
                                                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                                <span className="sr-only">Login with Google</span>
                                            </Button>
                                            <Button
                                                disabled={ispending}
                                                onClick={handleSocialLogin.githubLogin}
                                                variant="outline" type="button" className="w-full">
                                                <Github className="size-5" />
                                                <span className="sr-only">Login with Github</span>
                                            </Button>
                                        </div>
                                        <div className="text-center text-sm">
                                            Already have an account?{" "}
                                            <a href="/signin" className="underline underline-offset-4">
                                                Sign In
                                            </a>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                            <div className="bg-muted relative hidden md:block">
                                <img
                                    src="/user-form-banner.png"
                                    alt="Image"
                                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                        and <a href="#">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </div>
    )
}