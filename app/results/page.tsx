'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import type { ATSScore } from '@/lib/types/analysis.types';
import AnimatedBackground from '@/components/animations/AnimatedBackground';
import ScoreDonut from '@/components/results/ScoreDonut';
import BreakdownBars from '@/components/results/BreakdownBars';
import KeywordMatches from '@/components/results/KeywordMatches';
import MissingKeywords from '@/components/results/MissingKeywords';
import SkillsBreakdown from '@/components/results/SkillsBreakdown';
import FormattingIssues from '@/components/results/FormattingIssues';
import Suggestions from '@/components/results/Suggestions';
import ExportButton from '@/components/results/ExportButton';
import ResultsSkeleton from '@/components/results/ResultsSkeleton';

import HistoryDrawer from '@/components/shared/HistoryDrawer';

export default function ResultsPage() {
    const router = useRouter();
    const [score, setScore] = useState<ATSScore | null>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem('ats-results');
        if (stored) {
            setScore(JSON.parse(stored));
        } else {
            router.push('/analyzer');
        }
    }, [router]);

    if (!score) {
        return <ResultsSkeleton />;
    }

    return (
        <>
            <AnimatedBackground />
            <HistoryDrawer />

            <main className="min-h-screen pt-24 pb-16 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-1">
                                Your <span className="gradient-text">ATS Score</span>
                            </h1>
                            {score.metadata.jobTitle && (
                                <p className="text-sm text-muted">
                                    Analyzed for: <span className="text-foreground">{score.metadata.jobTitle}</span>
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <ExportButton score={score} />
                            <button
                                className="btn-primary text-sm py-2 px-5"
                                onClick={() => router.push('/analyzer')}
                            >
                                <RotateCcw size={14} />
                                Analyze Again
                            </button>
                        </div>
                    </motion.div>

                    {/* Score + Breakdown */}
                    <div className="grid lg:grid-cols-3 gap-6 mb-6">
                        <motion.div
                            className="glass-card p-8 flex items-center justify-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <ScoreDonut score={score.overall} />
                        </motion.div>

                        <motion.div
                            className="lg:col-span-2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <BreakdownBars sections={score.sections} />
                        </motion.div>
                    </div>

                    {/* Keywords */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <KeywordMatches keywords={score.matchedKeywords} />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <MissingKeywords keywords={score.missingKeywords} />
                        </motion.div>
                    </div>

                    {/* Skills + Formatting */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <SkillsBreakdown skills={score.skills} />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <FormattingIssues issues={score.formattingIssues} />
                        </motion.div>
                    </div>

                    {/* Suggestions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <Suggestions suggestions={score.suggestions} />
                    </motion.div>

                    {/* Metadata */}
                    <motion.div
                        className="mt-8 text-center text-xs text-muted space-x-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <span>Resume: {score.metadata.resumeWordCount} words</span>
                        <span>•</span>
                        <span>JD: {score.metadata.jdWordCount} words</span>
                        <span>•</span>
                        <span>Analyzed: {new Date(score.metadata.analyzedAt).toLocaleString()}</span>
                    </motion.div>

                    {/* Back button */}
                    <motion.div
                        className="mt-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                    >
                        <button
                            className="btn-ghost text-sm py-2 px-6"
                            onClick={() => router.push('/analyzer')}
                        >
                            <ArrowLeft size={14} />
                            Back to Analyzer
                        </button>
                    </motion.div>
                </div>
            </main>
        </>
    );
}
