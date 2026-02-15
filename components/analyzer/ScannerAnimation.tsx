'use client';

import { motion } from 'framer-motion';

export default function ScannerAnimation() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div
                className="relative w-80 h-96 glass-card overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Document lines */}
                <div className="p-6 space-y-3">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="h-2 rounded-full bg-surface-light"
                            style={{ width: `${40 + Math.random() * 55}%` }}
                            initial={{ opacity: 0.3 }}
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
                        />
                    ))}
                </div>

                {/* Scanner line */}
                <motion.div
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                    style={{ boxShadow: '0 0 20px var(--primary), 0 0 60px var(--primary)' }}
                    initial={{ top: '0%' }}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Label */}
                <div className="absolute bottom-6 left-0 right-0 text-center">
                    <motion.p
                        className="text-sm font-medium text-primary-light"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        Analyzing your resume...
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
}
