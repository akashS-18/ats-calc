'use client';

import { motion } from 'framer-motion';

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Grid pattern */}
            <div className="absolute inset-0 grid-pattern" />

            {/* Primary orb */}
            <motion.div
                className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20"
                style={{
                    background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
                }}
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Accent orb */}
            <motion.div
                className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15"
                style={{
                    background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
                }}
                animate={{
                    scale: [1, 1.15, 1],
                    x: [0, -20, 0],
                    y: [0, 30, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Small floating orbs */}
            <motion.div
                className="absolute top-1/3 left-1/4 w-3 h-3 rounded-full bg-primary-light opacity-40"
                animate={{ y: [0, -30, 0], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
                className="absolute top-2/3 right-1/3 w-2 h-2 rounded-full bg-accent opacity-30"
                animate={{ y: [0, -25, 0], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 7, repeat: Infinity, delay: 1 }}
            />
            <motion.div
                className="absolute top-1/2 right-1/4 w-4 h-4 rounded-full bg-primary opacity-20"
                animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: 2 }}
            />
        </div>
    );
}
