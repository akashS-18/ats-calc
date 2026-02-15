'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileSearch, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-50 border-b border-surface-border/50"
            style={{ background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(20px)' }}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <FileSearch size={18} className="text-white" />
                    </div>
                    <span className="text-lg font-bold">
                        ATS<span className="gradient-text">Score</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/#features" className="text-sm text-muted hover:text-foreground transition-colors">
                        Features
                    </Link>
                    <Link href="/#how-it-works" className="text-sm text-muted hover:text-foreground transition-colors">
                        How It Works
                    </Link>
                    <Link href="/analyzer" className="btn-primary text-sm py-2 px-6">
                        Analyze Resume
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-muted" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    className="md:hidden border-t border-surface-border/50 px-6 py-4 space-y-4"
                    style={{ background: 'rgba(10, 10, 15, 0.95)' }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                >
                    <Link href="/#features" className="block text-sm text-muted hover:text-foreground" onClick={() => setIsOpen(false)}>
                        Features
                    </Link>
                    <Link href="/#how-it-works" className="block text-sm text-muted hover:text-foreground" onClick={() => setIsOpen(false)}>
                        How It Works
                    </Link>
                    <Link href="/analyzer" className="btn-primary text-sm py-2 px-6 w-full justify-center" onClick={() => setIsOpen(false)}>
                        Analyze Resume
                    </Link>
                </motion.div>
            )}
        </motion.nav>
    );
}
