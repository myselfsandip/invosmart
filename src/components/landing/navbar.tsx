"use client"

import { Button } from '@/components/ui/button';
import {
    Menu,
    X,
    FileText,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ModeToggle } from '../mode-toggle';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    return (
        <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                            <FileText className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                            InvoSmart
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="#features"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Features
                        </Link>
                        <Link
                            href="#pricing"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="#testimonials"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Testimonials
                        </Link>
                        <div className="h-6 w-px bg-border" />
                        <ModeToggle />
                        <Button
                            onClick={() => router.push("/signin")}
                            variant="ghost"
                            size="sm"
                        >
                            Sign In
                        </Button>
                        <Button
                            onClick={() => router.push("/signup")}
                            size="sm"
                        >
                            Get Started
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <ModeToggle />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md hover:bg-accent transition-colors"
                            aria-label="Toggle mobile menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-sm">
                    <div className="px-4 py-4 space-y-3">
                        <Link
                            href="#features"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Features
                        </Link>
                        <Link
                            href="#pricing"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="#testimonials"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Testimonials
                        </Link>
                        <div className="h-px bg-border my-2" />
                        <div className="pt-2 space-y-2">
                            <Button
                                onClick={() => {
                                    router.push("/signin");
                                    setMobileMenuOpen(false);
                                }}
                                variant="ghost"
                                className="w-full"
                                size="sm"
                            >
                                Sign In
                            </Button>
                            <Button
                                onClick={() => {
                                    router.push("/signup");
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full"
                                size="sm"
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
