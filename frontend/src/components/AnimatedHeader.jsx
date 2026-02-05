import React from 'react';
import { motion } from 'framer-motion';
import { MOTION_TOKENS } from './MotionConfig';

function AnimatedHeader({ user, progress }) {
    const radius = 34;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
                <motion.p
                    className="text-sm uppercase tracking-[0.2em] text-slate-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, ...MOTION_TOKENS.springGentle }}
                >
                    Welcome, {user.name}
                </motion.p>
                <motion.h1
                    className="mt-2 text-4xl font-semibold"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, ...MOTION_TOKENS.springGentle }}
                >
                    Your focus feels effortless.
                </motion.h1>
                <motion.p
                    className="mt-3 text-sm text-slate-300"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, ...MOTION_TOKENS.springGentle }}
                >
                    Continue the story with purposeful momentum.
                </motion.p>
            </div>

            <motion.div
                className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 shadow-[0_20px_40px_rgba(15,23,42,0.4)]"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, ...MOTION_TOKENS.springGentle }}
            >
                <svg width="84" height="84" className="-rotate-90">
                    <circle
                        cx="42"
                        cy="42"
                        r={radius}
                        stroke="rgba(148,163,184,0.2)"
                        strokeWidth="8"
                        fill="transparent"
                    />
                    <motion.circle
                        cx="42"
                        cy="42"
                        r={radius}
                        stroke="url(#progressGradient)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.2, ease: MOTION_TOKENS.easeSoft }}
                    />
                    <defs>
                        <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="50%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#e879f9" />
                        </linearGradient>
                    </defs>
                </svg>
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Progress
                    </p>
                    <p className="text-2xl font-semibold text-white">{progress}%</p>
                </div>
            </motion.div>
        </div>
    );
}

export default AnimatedHeader;
