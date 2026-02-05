import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MOTION_TOKENS } from './MotionConfig';

const floatingDots = Array.from({ length: 12 }, (_, index) => ({
    id: `dot-${index}`,
    size: 24 + index * 3,
    delay: index * 0.2,
    x: `${10 + index * 6}%`,
    y: `${20 + (index % 4) * 18}%`,
}));

function AnimatedSplash({ onComplete }) {
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        if (!onComplete) return;
        const timer = setTimeout(() => onComplete(), 2300);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.section
            className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="absolute inset-0 animated-gradient" />
            <div className="absolute inset-0 bg-slate-950/60" />

            {floatingDots.map((dot) => (
                <motion.span
                    key={dot.id}
                    className="absolute rounded-full bg-cyan-300/20 blur-2xl"
                    style={{
                        width: dot.size,
                        height: dot.size,
                        left: dot.x,
                        top: dot.y,
                    }}
                    animate={
                        reduceMotion
                            ? { opacity: 0.6 }
                            : {
                                  y: [0, -20, 0],
                                  opacity: [0.3, 0.8, 0.4],
                              }
                    }
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        delay: dot.delay,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            <motion.div
                layoutId="auth-card"
                className="relative z-10 flex flex-col items-center gap-6 rounded-[32px] border border-white/10 bg-white/5 px-12 py-14 text-center shadow-[0_0_60px_rgba(56,189,248,0.2)] backdrop-blur-xl"
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={MOTION_TOKENS.springGentle}
            >
                <motion.div
                    layoutId="app-logo"
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10"
                >
                    <motion.span
                        className="text-3xl font-semibold tracking-tight text-white"
                        initial={{ filter: 'blur(8px)', opacity: 0 }}
                        animate={{ filter: 'blur(0px)', opacity: 1 }}
                        transition={{ duration: 1.2, ease: MOTION_TOKENS.easeSoft }}
                    >
                        T
                    </motion.span>
                </motion.div>
                <div>
                    <motion.h1
                        className="text-3xl font-semibold tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, ...MOTION_TOKENS.springGentle }}
                    >
                        Todo Aurora
                    </motion.h1>
                    <motion.p
                        className="mt-2 text-sm text-slate-200/80"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, ...MOTION_TOKENS.springGentle }}
                    >
                        A cinematic way to focus.
                    </motion.p>
                </div>
                <motion.div
                    className="h-1 w-24 rounded-full bg-gradient-to-r from-cyan-300/40 via-indigo-400/60 to-fuchsia-400/40"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 1, ease: MOTION_TOKENS.ease }}
                    style={{ transformOrigin: 'center' }}
                />
            </motion.div>
        </motion.section>
    );
}

export default AnimatedSplash;
