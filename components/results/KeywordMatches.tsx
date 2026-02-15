'use client';

import { motion } from 'framer-motion';
import type { MatchedKeyword } from '@/lib/types/analysis.types';
import { Check } from 'lucide-react';

interface KeywordMatchesProps {
    keywords: MatchedKeyword[];
}

export default function KeywordMatches({ keywords }: KeywordMatchesProps) {
    if (keywords.length === 0) return null;

    const required = keywords.filter(k => k.source === 'required');
    const preferred = keywords.filter(k => k.source === 'preferred');

    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Check size={18} className="text-success" />
                Matched Keywords ({keywords.length})
            </h3>

            {required.length > 0 && (
                <div className="mb-4">
                    <p className="text-xs text-muted mb-2 uppercase tracking-wider">Required</p>
                    <div className="flex flex-wrap gap-2">
                        {required.map((kw, i) => (
                            <motion.span
                                key={i}
                                className="px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.03 }}
                                title={kw.context}
                            >
                                {kw.keyword}
                                {kw.count > 1 && <span className="ml-1 opacity-60">×{kw.count}</span>}
                            </motion.span>
                        ))}
                    </div>
                </div>
            )}

            {preferred.length > 0 && (
                <div>
                    <p className="text-xs text-muted mb-2 uppercase tracking-wider">Preferred</p>
                    <div className="flex flex-wrap gap-2">
                        {preferred.map((kw, i) => (
                            <motion.span
                                key={i}
                                className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.03 }}
                                title={kw.context}
                            >
                                {kw.keyword}
                            </motion.span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
