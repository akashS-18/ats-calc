'use client';

import { motion } from 'framer-motion';
import type { SkillCluster } from '@/lib/types/analysis.types';
import { Code2, Wrench, Heart } from 'lucide-react';

interface SkillsBreakdownProps {
    skills: SkillCluster[];
}

const icons = { hard: Code2, tool: Wrench, soft: Heart };
const labels = { hard: 'Hard Skills', tool: 'Tools & Frameworks', soft: 'Soft Skills' };
const colors = { hard: '#6366f1', tool: '#06b6d4', soft: '#ec4899' };

export default function SkillsBreakdown({ skills }: SkillsBreakdownProps) {
    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-5">Skills Analysis</h3>
            <div className="space-y-5">
                {skills.map((cluster, i) => {
                    const Icon = icons[cluster.category];
                    const label = labels[cluster.category];
                    const color = colors[cluster.category];

                    return (
                        <motion.div
                            key={cluster.category}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Icon size={16} style={{ color }} />
                                    <span className="text-sm font-medium">{label}</span>
                                </div>
                                <span className="text-sm font-semibold" style={{ color }}>
                                    {cluster.score}%
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="h-1.5 rounded-full bg-surface-light overflow-hidden mb-3">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${cluster.score}%` }}
                                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                                />
                            </div>

                            {/* Matched */}
                            {cluster.matched.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {cluster.matched.map((s, j) => (
                                        <span key={j} className="px-2 py-0.5 rounded text-[11px] bg-success/10 text-success">
                                            ✓ {s}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Missing */}
                            {cluster.missing.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {cluster.missing.map((s, j) => (
                                        <span key={j} className="px-2 py-0.5 rounded text-[11px] bg-danger/10 text-danger">
                                            ✗ {s}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
