import { FileSearch } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-surface-border/50 mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <FileSearch size={14} className="text-white" />
                        </div>
                        <span className="text-sm font-bold">
                            ATS<span className="gradient-text">Score</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted">
                        <Link href="/#features" className="hover:text-foreground transition-colors">Features</Link>
                        <Link href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
                        <Link href="/analyzer" className="hover:text-foreground transition-colors">Analyzer</Link>
                    </div>
                    <p className="text-xs text-muted">
                        © {new Date().getFullYear()} ATS Score Calculator. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
