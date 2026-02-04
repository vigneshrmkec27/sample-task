import React from 'react';
import { motion } from 'framer-motion';
import { motionTokens } from './MotionConfig';

const particles = Array.from({ length: 6 });

const AnimatedSplash = ({ onComplete }) => {
    return (
        <motion.section
            className="relative flex min-h-screen items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.duration.slow }}
        >
            <div className="absolute inset-0 aurora-gradient" />
            <div className="noise-layer" />

            {particles.map((_, index) => (
                <motion.span
                    key={`particle-${index}`}
                    className="absolute h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl"
                    style={{
                        top: `${10 + index * 12}%`,
                        left: `${12 + index * 13}%`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.15, 0.35, 0.2],
                    }}
                    transition={{
                        duration: 8 + index,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            <motion.div
                layoutId="auth-shell"
                className="relative z-10 flex flex-col items-center gap-5 rounded-[32px] border border-white/10 bg-white/5 px-10 py-12 text-center shadow-2xl backdrop-blur-2xl"
            >
                <motion.div
                    className="text-xs uppercase tracking-[0.3em] text-indigo-200/70"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: motionTokens.duration.fast }}
                >
                    Lucid Tasks
                </motion.div>
                <motion.h1
                    className="text-4xl font-semibold text-white md:text-5xl"
                    initial={{ opacity: 0, filter: 'blur(12px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ delay: 0.4, duration: motionTokens.duration.slow }}
                >
                    A cinematic flow for focus.
                </motion.h1>
                <motion.p
                    className="max-w-sm text-sm text-slate-200/80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: motionTokens.duration.medium }}
                >
                    Let your tasks arrive with intention. Motion guides every moment.
                </motion.p>
                <motion.button
                    type="button"
                    onClick={onComplete}
                    className="mt-4 rounded-full border border-white/20 bg-white/10 px-6 py-2 text-sm text-white shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={motionTokens.spring.snappy}
                >
                    Enter experience
                </motion.button>
            </motion.div>
        </motion.section>
    );
};

export default AnimatedSplash;
