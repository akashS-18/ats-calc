'use client';

import { motion } from 'framer-motion';
import { Search, BarChart3, Target, Lightbulb } from 'lucide-react';

const features = [
    {
        icon: Search,
        title: 'Smart Keyword Analysis',
        description: 'Identifies required and preferred keywords from the job description and checks for matches in your resume.',
        color: 'from-blue-500 to-indigo-500',
    },
    {
        icon: BarChart3,
        title: 'Multi-Dimension Scoring',
        description: '6 scoring dimensions including keyword relevance, skills match, text similarity, and formatting quality.',
        color: 'from-emerald-500 to-teal-500',
    },
    {
        icon: Target,
        title: 'Skills Gap Detection',
        description: 'Cross-references 130+ skills with synonym support to find exactly what your resume is missing.',
        color: 'from-orange-500 to-amber-500',
    },
    {
        icon: Lightbulb,
        title: 'Actionable Suggestions',
        description: 'Get prioritized, specific recommendations with estimated score impact for each improvement.',
        color: 'from-purple-500 to-pink-500',
    },
];

export default function Features() {
    return (
        <section id="features" className="py-24">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Why Use <span className="gradient-text">ATS Score</span>?
                    </h2>
                    <p className="text-muted max-w-xl mx-auto">
                        Our algorithmic engine provides deep, multi-dimensional analysis without sending your data to any external service.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            className="glass-card glass-card-hover p-6 group"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <feature.icon size={22} className="text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                            <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
