'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-16">
            <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-surface-border/80 bg-surface/50 text-sm text-muted mb-8"
                >
                    <Sparkles size={14} className="text-accent" />
                    Free • No Sign-up Required • 100% Private
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-5xl md:text-7xl font-bold leading-tight mb-6"
                >
                    Optimize Your Resume
                    <br />
                    <span className="gradient-text">Beat the ATS</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Instantly analyze your resume against any job description. Get a detailed
                    ATS compatibility score, keyword analysis, and actionable suggestions to
                    land more interviews.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/analyzer" className="btn-primary text-base py-3 px-8 neon-glow">
                        Analyze Your Resume
                        <ArrowRight size={18} />
                    </Link>
                    <Link href="/#how-it-works" className="btn-ghost text-base py-3 px-8">
                        Learn More
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
                >
                    {[
                        { value: '130+', label: 'Skills Tracked' },
                        { value: '6', label: 'Score Dimensions' },
                        { value: '100%', label: 'Client-Side' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                            <div className="text-xs text-muted mt-1">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Floating decorative elements */}
                <div className="absolute top-1/4 left-10 hidden lg:block">
                    <motion.div
                        className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"
                        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                    >
                        <Zap size={20} className="text-primary-light" />
                    </motion.div>
                </div>
                <div className="absolute bottom-1/3 right-10 hidden lg:block">
                    <motion.div
                        className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center"
                        animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
                        transition={{ duration: 7, repeat: Infinity, delay: 1 }}
                    >
                        <Shield size={20} className="text-accent" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
