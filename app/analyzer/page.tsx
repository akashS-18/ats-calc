'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import ResumeInput from '@/components/analyzer/ResumeInput';
import JobDescInput from '@/components/analyzer/JobDescInput';
import ScannerAnimation from '@/components/analyzer/ScannerAnimation';
import AnimatedBackground from '@/components/animations/AnimatedBackground';
import { Zap, RotateCcw } from 'lucide-react';
import type { ATSScore } from '@/lib/types/analysis.types';
import { saveAnalysis } from '@/lib/utils/storage';

import HistoryDrawer from '@/components/shared/HistoryDrawer';

export default function AnalyzerPage() {
    const router = useRouter();
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [fileName, setFileName] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async () => {
        if (!resumeText.trim()) {
            toast.error('Please provide your resume text.');
            return;
        }
        if (!jobDescription.trim()) {
            toast.error('Please provide the job description.');
            return;
        }

        setIsAnalyzing(true);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeText: resumeText.trim(),
                    jobDescription: jobDescription.trim(),
                    resumeFileName: fileName || undefined,
                }),
            });

            const data = await response.json();

            if (!data.success) {
                toast.error(data.error || 'Analysis failed');
                return;
            }

            const score: ATSScore = data.data;

            // Save to history
            const jobTitle = score.metadata.jobTitle || 'Untitled Position';
            saveAnalysis(score, resumeText.trim(), jobTitle);

            // Store results in sessionStorage for the results page
            sessionStorage.setItem('ats-results', JSON.stringify(score));
            sessionStorage.setItem('ats-resume-text', resumeText.trim());
            sessionStorage.setItem('ats-jd-text', jobDescription.trim());

            router.push('/results');
        } catch (error) {
            console.error('Analysis error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => {
        setResumeText('');
        setJobDescription('');
        setFileName('');
    };

    return (
        <>
            <AnimatedBackground />
            {isAnalyzing && <ScannerAnimation />}
            <HistoryDrawer />

            <main className="min-h-screen pt-24 pb-16 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-bold mb-3">
                            <span className="gradient-text">Analyze</span> Your Resume
                        </h1>
                        <p className="text-muted max-w-lg mx-auto">
                            Paste your resume and the target job description below. We&apos;ll analyze compatibility across 6 dimensions.
                        </p>
                    </motion.div>

                    {/* Two-column layout */}
                    <div className="grid lg:grid-cols-2 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <ResumeInput
                                value={resumeText}
                                onChange={setResumeText}
                                onFileNameChange={setFileName}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <JobDescInput
                                value={jobDescription}
                                onChange={setJobDescription}
                            />
                        </motion.div>
                    </div>

                    {/* Actions */}
                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <button
                            className="btn-primary text-base py-3 px-10 neon-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !resumeText.trim() || !jobDescription.trim()}
                        >
                            <Zap size={18} />
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
                        </button>
                        <button
                            className="btn-ghost text-base py-3 px-8"
                            onClick={handleReset}
                        >
                            <RotateCcw size={16} />
                            Reset
                        </button>
                    </motion.div>
                </div>
            </main>
        </>
    );
}
