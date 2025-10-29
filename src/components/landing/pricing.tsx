import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const pricingPlans = [
    {
        name: 'Free',
        description: 'Perfect for getting started',
        price: '₹0',
        period: '/month',
        features: [
            'Up to 5 invoices/month',
            'Basic templates',
            '1 organization',
            'Email support',
            'PDF export'
        ],
        buttonText: 'Start Free',
        buttonVariant: 'outline' as const,
        popular: false
    },
    {
        name: 'Pro',
        description: 'For growing businesses',
        price: '₹499',
        period: '/month',
        features: [
            'Unlimited invoices',
            'Custom templates',
            '5 organizations',
            'Priority support',
            'PDF export & CSV',
            'Payment analytics',
            'Automated reminders',
            'API access'
        ],
        buttonText: 'Get Started',
        buttonVariant: 'default' as const,
        popular: true
    },
    {
        name: 'Enterprise',
        description: 'For large organizations',
        price: 'Custom',
        period: '',
        features: [
            'Everything in Pro',
            'Unlimited organizations',
            'White-label solution',
            'Dedicated support',
            'Custom integrations',
            'Advanced security',
            'SLA guarantee',
            'Training & onboarding'
        ],
        buttonText: 'Contact Sales',
        buttonVariant: 'outline' as const,
        popular: false
    }
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Choose the plan that fits your business needs
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {pricingPlans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`p-8 bg-card hover:shadow-xl transition-shadow relative ${plan.popular ? 'border-2 border-primary' : ''
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <p className="text-muted-foreground mb-6">{plan.description}</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-muted-foreground">{plan.period}</span>
                            </div>
                            <Button variant={plan.buttonVariant} className="w-full mb-6">
                                {plan.buttonText}
                            </Button>
                            <ul className="space-y-3">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-chart-2 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
