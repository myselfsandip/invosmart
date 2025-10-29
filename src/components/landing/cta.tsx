import { Button } from '@/components/ui/button';

export default function CTA() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                    Ready to Transform Your Invoicing?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Join thousands of businesses already using InvoSmart to streamline their billing workflow
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="w-full sm:w-auto">
                        Start Free Trial
                    </Button>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        Schedule Demo
                    </Button>
                </div>
            </div>
        </section>
    );
}
