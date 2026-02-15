'use client';

import { motion } from 'framer-motion';
import type { Suggestion } from '@/lib/types/analysis.types';
import { Lightbulb, TrendingUp } from 'lucide-react';

interface SuggestionsProps {
    suggestions: Suggestion[];
}

const priorityColors = {
    high: { bg: 'bg-danger/5', border: 'border-danger/20', badge: 'bg-danger/10 text-danger' },
    medium: { bg: 'bg-warning/5', border: 'border-warning/20', badge: 'bg-warning/10 text-warning' },
    low: { bg: 'bg-accent/5', border: 'border-accent/20', badge: 'bg-accent/10 text-accent' },
};

export default function Suggestions({ suggestions }: SuggestionsProps) {
    if (suggestions.length === 0) return null;

    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lightbulb size={18} className="text-warning" />
                Improvement Suggestions
            </h3>
            <div className="space-y-3">
                {suggestions.map((s, i) => {
                    const style = priorityColors[s.priority];
                    return (
                        <motion.div
                            key={s.id}
                            className={`p-4 rounded-xl border ${style.bg} ${style.border}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="flex items-start justify-between gap-3 mb-1">
                                <h4 className="text-sm font-semibold">{s.title}</h4>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${style.badge}`}>
                                        {s.priority}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-success">
                                        <TrendingUp size={12} />
                                        {s.impact}
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-muted leading-relaxed">{s.description}</p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
