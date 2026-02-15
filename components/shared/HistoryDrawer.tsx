'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, Trash2, Clock, Trophy } from 'lucide-react';
import { getAllHistory, deleteEntry, clearHistory } from '@/lib/utils/storage';
import type { AnalysisHistoryEntry } from '@/lib/types/analysis.types';
import { getBandInfo } from '@/lib/constants/scoring';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function HistoryDrawer() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [entries, setEntries] = useState<AnalysisHistoryEntry[]>([]);

    useEffect(() => {
        if (isOpen) {
            setEntries(getAllHistory());
        }
    }, [isOpen]);

    const handleView = (entry: AnalysisHistoryEntry) => {
        sessionStorage.setItem('ats-results', JSON.stringify(entry.score));
        setIsOpen(false);
        router.push('/results');
    };

    const handleDelete = (id: string) => {
        deleteEntry(id);
        setEntries(e => e.filter(x => x.id !== id));
    };

    const handleClear = () => {
        clearHistory();
        setEntries([]);
    };

    return (
        <>
            {/* Toggle button */}
            <button
                className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors z-40 neon-glow"
                onClick={() => setIsOpen(true)}
                title="View History"
            >
                <History size={20} className="text-white" />
            </button>

            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/50 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-surface-border z-50 overflow-y-auto"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-surface/90 backdrop-blur-sm border-b border-surface-border p-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <History size={18} className="text-primary-light" />
                                    Analysis History
                                </h2>
                                <div className="flex items-center gap-2">
                                    {entries.length > 0 && (
                                        <button
                                            className="text-xs text-danger hover:text-danger/80 transition-colors"
                                            onClick={handleClear}
                                        >
                                            Clear All
                                        </button>
                                    )}
                                    <button onClick={() => setIsOpen(false)} className="text-muted hover:text-foreground">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                {entries.length === 0 ? (
                                    <div className="text-center py-12 text-muted">
                                        <Clock size={32} className="mx-auto mb-3 opacity-50" />
                                        <p className="text-sm">No analyses yet.</p>
                                        <p className="text-xs mt-1">Your past analyses will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {entries.map((entry) => {
                                            const bandInfo = getBandInfo(entry.score.overall);
                                            return (
                                                <motion.div
                                                    key={entry.id}
                                                    className="glass-card p-4 cursor-pointer hover:border-primary/50 transition-colors group"
                                                    onClick={() => handleView(entry)}
                                                    layout
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                                                                style={{
                                                                    backgroundColor: `${bandInfo.color}15`,
                                                                    color: bandInfo.color,
                                                                }}
                                                            >
                                                                {entry.score.overall}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">{entry.jobTitle || 'Untitled'}</p>
                                                                <p className="text-xs text-muted">
                                                                    {format(new Date(entry.createdAt), 'MMM d, yyyy h:mm a')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="opacity-0 group-hover:opacity-100 text-muted hover:text-danger transition-all"
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-muted line-clamp-2">
                                                        {entry.resumePreview}
                                                    </p>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
