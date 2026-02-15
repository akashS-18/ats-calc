'use client';

import { motion } from 'framer-motion';
import { getBandInfo } from '@/lib/constants/scoring';

interface ScoreDonutProps {
    score: number;
}

export default function ScoreDonut({ score }: ScoreDonutProps) {
    const bandInfo = getBandInfo(score);
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="var(--surface-light)"
                        strokeWidth="8"
                    />
                    {/* Score arc */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={bandInfo.color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        style={{ filter: `drop-shadow(0 0 8px ${bandInfo.color}40)` }}
                    />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        className="text-4xl font-bold"
                        style={{ color: bandInfo.color }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        {score}
                    </motion.span>
                    <span className="text-xs text-muted">/100</span>
                </div>
            </div>

            {/* Band label */}
            <motion.div
                className="mt-4 px-4 py-1.5 rounded-full text-sm font-semibold"
                style={{
                    backgroundColor: `${bandInfo.color}15`,
                    color: bandInfo.color,
                    border: `1px solid ${bandInfo.color}30`,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                {bandInfo.label}
            </motion.div>
        </div>
    );
}
