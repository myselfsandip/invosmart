import { Metadata } from 'next';

import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import Pricing from '@/components/landing/pricing';
import Testimonials from '@/components/landing/testimonials';
import CTA from '@/components/landing/cta';
import Footer from '@/components/landing/footer';
import Navbar from '@/components/landing/navbar';

export const metadata: Metadata = {
    title: 'InvoSmart - Modern Invoice & Payment Management SaaS',
    description: 'Streamline your billing workflow with our powerful multi-tenant invoice management platform. Create, send, and track invoices in seconds — anytime, anywhere.',
    keywords: ['invoice management', 'billing software', 'payment tracking', 'SaaS', 'multi-tenant', 'business invoicing'],
    authors: [{ name: 'InvoSmart' }],
    openGraph: {
        title: 'InvoSmart - Modern Invoice & Payment Management SaaS',
        description: 'Create professional invoices in seconds and get paid faster with InvoSmart',
        type: 'website',
        locale: 'en_IN',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'InvoSmart - Modern Invoice & Payment Management SaaS',
        description: 'Create professional invoices in seconds and get paid faster with InvoSmart',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <Hero />
            <Features />
            <Pricing />
            <Testimonials />
            <CTA />
            <Footer />
        </div>
    );
}
