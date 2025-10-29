import { Card } from '@/components/ui/card';
import {
    Zap,
    Shield,
    Globe,
    BarChart3,
    CreditCard,
    FileText
} from 'lucide-react';

const features = [
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Create and send invoices in under 30 seconds with our intuitive interface',
        color: 'text-chart-1'
    },
    {
        icon: Shield,
        title: 'Bank-Level Security',
        description: 'Your data is encrypted and protected with enterprise-grade security',
        color: 'text-chart-2'
    },
    {
        icon: Globe,
        title: 'Multi-Tenant Architecture',
        description: 'Complete data isolation for each organization with role-based access control',
        color: 'text-chart-3'
    },
    {
        icon: BarChart3,
        title: 'Real-time Analytics',
        description: 'Track revenue, payment status, and client insights with live dashboards',
        color: 'text-chart-4'
    },
    {
        icon: CreditCard,
        title: 'Payment Integration',
        description: 'Accept payments via Stripe, PayPal, and other popular payment gateways',
        color: 'text-chart-5'
    },
    {
        icon: FileText,
        title: 'PDF Generation',
        description: 'Professional invoices with customizable templates and automatic PDF export',
        color: 'text-chart-1'
    }
];

export default function Features() {
    return (
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Everything You Need to Manage Invoices
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Built for modern businesses with powerful features that scale with your growth
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="p-6 hover:shadow-lg transition-shadow bg-card">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
