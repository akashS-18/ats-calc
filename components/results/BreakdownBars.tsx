'use client';

import { motion } from 'framer-motion';
import type { SectionScores } from '@/lib/types/analysis.types';

interface BreakdownBarsProps {
    sections: SectionScores;
}

const barConfig = [
    { key: 'keywordRelevance' as const, label: 'Keyword Relevance', max: 30, color: '#6366f1' },
    { key: 'requiredSkills' as const, label: 'Required Skills', max: 30, color: '#06b6d4' },
    { key: 'titleAlignment' as const, label: 'Title Alignment', max: 10, color: '#8b5cf6' },
    { key: 'textSimilarity' as const, label: 'Text Similarity', max: 15, color: '#f59e0b' },
    { key: 'formatting' as const, label: 'Formatting', max: 10, color: '#22c55e' },
    { key: 'bonus' as const, label: 'Bonus Points', max: 5, color: '#ec4899' },
];

export default function BreakdownBars({ sections }: BreakdownBarsProps) {
    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-5">Score Breakdown</h3>
            <div className="space-y-4">
                {barConfig.map((bar, i) => {
                    const value = sections[bar.key];
                    const percentage = (value / bar.max) * 100;

                    return (
                        <div key={bar.key}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm text-muted">{bar.label}</span>
                                <span className="text-sm font-semibold" style={{ color: bar.color }}>
                                    {value}/{bar.max}
                                </span>
                            </div>
                            <div className="h-2.5 rounded-full bg-surface-light overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: bar.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
