import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, ArrowRight, FileText, TrendingUp, Users } from 'lucide-react';

export default function Hero() {
    return (
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                        <Zap className="w-4 h-4" />
                        Multi-tenant SaaS Invoice Platform
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        Invoice on the Go,
                        <br />
                        Get Paid Fast
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Streamline your billing workflow with our powerful multi-tenant invoice management platform.
                        Create, send, and track invoices in seconds — anytime, anywhere.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button size="lg" className="w-full sm:w-auto group">
                            Start Free Trial
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button size="lg" variant="outline" className="w-full sm:w-auto">
                            Watch Demo
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                        No credit card required • 14-day free trial • Cancel anytime
                    </p>
                </div>

                {/* Hero Dashboard Preview */}
                <div className="mt-16 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                    <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
                        <div className="bg-muted/50 border-b border-border px-4 py-3 flex items-center gap-2">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                                <div className="w-3 h-3 rounded-full bg-chart-4/80" />
                                <div className="w-3 h-3 rounded-full bg-chart-2/80" />
                            </div>
                        </div>
                        <div className="p-8 bg-muted/30">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <Card className="p-4 bg-card">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-chart-1/20 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-chart-1" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Invoices</p>
                                            <p className="text-2xl font-bold">1,247</p>
                                        </div>
                                    </div>
                                </Card>
                                <Card className="p-4 bg-card">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-chart-2/20 flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-chart-2" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Revenue</p>
                                            <p className="text-2xl font-bold">₹12.4L</p>
                                        </div>
                                    </div>
                                </Card>
                                <Card className="p-4 bg-card">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-chart-3/20 flex items-center justify-center">
                                            <Users className="w-5 h-5 text-chart-3" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Active Clients</p>
                                            <p className="text-2xl font-bold">342</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                            <div className="h-48 bg-gradient-to-br from-primary/10 to-chart-1/10 rounded-lg flex items-center justify-center border border-border">
                                <svg className="w-full h-full p-6" viewBox="0 0 400 200">
                                    <polyline
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="text-primary"
                                        points="0,150 50,120 100,130 150,90 200,100 250,60 300,70 350,40 400,50"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
