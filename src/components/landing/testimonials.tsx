import { Card } from '@/components/ui/card';

const testimonials = [
    {
        name: 'Priya Sharma',
        role: 'Freelance Designer',
        content: 'InvoSmart transformed how I handle billing. I can now create professional invoices in seconds and get paid 2x faster.',
        avatar: 'PS'
    },
    {
        name: 'Rahul Verma',
        role: 'Agency Owner',
        content: 'The multi-tenant feature is perfect for managing multiple clients. Our team productivity increased by 40% after switching.',
        avatar: 'RV'
    },
    {
        name: 'Anjali Mehta',
        role: 'Startup Founder',
        content: 'The analytics dashboard gives me real-time insights into our cash flow. Best invoicing tool we\'ve used!',
        avatar: 'AM'
    }
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Trusted by Businesses Worldwide
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        See what our customers have to say about InvoSmart
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="p-6 bg-card">
                            <p className="text-muted-foreground mb-6 italic">
                                &quot;{testimonial.content}&quot;
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
