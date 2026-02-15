'use client';

import { motion } from 'framer-motion';
import { Upload, Cpu, FileText } from 'lucide-react';

const steps = [
    {
        icon: Upload,
        step: '01',
        title: 'Paste or Upload',
        description: 'Paste your resume text or upload a PDF/DOCX file along with the job description.',
    },
    {
        icon: Cpu,
        step: '02',
        title: 'Instant Analysis',
        description: 'Our engine analyzes keywords, skills, formatting, and text similarity in seconds.',
    },
    {
        icon: FileText,
        step: '03',
        title: 'Improve & Export',
        description: 'Review your score, fix highlighted issues, and download a detailed PDF report.',
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24">
            <div className="max-w-5xl mx-auto px-6">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        How It <span className="gradient-text">Works</span>
                    </h2>
                    <p className="text-muted max-w-lg mx-auto">
                        Three simple steps to an ATS-optimized resume.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((item, i) => (
                        <motion.div
                            key={i}
                            className="text-center relative"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                        >
                            {/* Connector line */}
                            {i < steps.length - 1 && (
                                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-surface-border to-transparent" />
                            )}

                            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl glass-card mb-6">
                                <item.icon size={28} className="text-primary-light" />
                                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-xs text-white font-bold flex items-center justify-center">
                                    {item.step}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                            <p className="text-sm text-muted leading-relaxed max-w-xs mx-auto">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
