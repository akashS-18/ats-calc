'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MissingKeyword } from '@/lib/types/analysis.types';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface MissingKeywordsProps {
    keywords: MissingKeyword[];
}

export default function MissingKeywords({ keywords }: MissingKeywordsProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (keywords.length === 0) return null;

    const required = keywords.filter(k => k.source === 'required');
    const preferred = keywords.filter(k => k.source === 'preferred');
    const preview = keywords.slice(0, 8);
    const remaining = keywords.length - 8;

    return (
        <div className="glass-card p-6">
            <button
                className="w-full flex items-center justify-between mb-4"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <AlertTriangle size={18} className="text-warning" />
                    Missing Keywords ({keywords.length})
                </h3>
                {remaining > 0 && (
                    isExpanded ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />
                )}
            </button>

            <AnimatePresence mode="wait">
                {!isExpanded ? (
                    <motion.div key="preview" className="flex flex-wrap gap-2" exit={{ opacity: 0 }}>
                        {preview.map((kw, i) => (
                            <span
                                key={i}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${kw.source === 'required'
                                        ? 'bg-danger/10 text-danger border border-danger/20'
                                        : 'bg-warning/10 text-warning border border-warning/20'
                                    }`}
                                title={kw.suggestion}
                            >
                                {kw.keyword}
                            </span>
                        ))}
                        {remaining > 0 && (
                            <span className="px-3 py-1 rounded-full text-xs text-muted bg-surface-light">
                                +{remaining} more
                            </span>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="expanded" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {required.length > 0 && (
                            <div className="mb-4">
                                <p className="text-xs text-muted mb-2 uppercase tracking-wider">Required — High Priority</p>
                                <div className="space-y-2">
                                    {required.map((kw, i) => (
                                        <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-danger/5">
                                            <span className="text-xs font-medium text-danger min-w-0">{kw.keyword}</span>
                                            <span className="text-xs text-muted">{kw.suggestion}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {preferred.length > 0 && (
                            <div>
                                <p className="text-xs text-muted mb-2 uppercase tracking-wider">Preferred — Nice to Have</p>
                                <div className="flex flex-wrap gap-2">
                                    {preferred.map((kw, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20"
                                        >
                                            {kw.keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
