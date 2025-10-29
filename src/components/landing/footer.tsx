import Link from 'next/link';
import { FileText } from 'lucide-react';

const footerLinks = {
    product: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Integrations', href: '#' },
        { name: 'API', href: '#' }
    ],
    company: [
        { name: 'About', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Contact', href: '#' }
    ],
    legal: [
        { name: 'Privacy', href: '#' },
        { name: 'Terms', href: '#' },
        { name: 'Security', href: '#' }
    ]
};

export default function Footer() {
    return (
        <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold">InvoSmart</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Modern invoice management for modern businesses
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:text-foreground transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:text-foreground transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:text-foreground transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground space-y-3">
                    <p>© 2025. All rights reserved.</p>
                    <p>Made with 💖 by Sandip Singha</p>
                </div>
            </div>
        </footer>
    );
}
