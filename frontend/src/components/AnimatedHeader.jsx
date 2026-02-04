import React from 'react';
import { motion } from 'framer-motion';
import { motionTokens } from './MotionConfig';
import ThemeToggle from './ThemeToggle';

const AnimatedHeader = ({ user, completionRate, onThemeToggle, darkMode }) => {
    return (
        <motion.header
            className="flex flex-col gap-6 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-2xl md:flex-row md:items-center md:justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionTokens.duration.medium, ease: motionTokens.ease.smooth }}
        >
            <div>
                <motion.p
                    className="text-xs uppercase tracking-[0.4em] text-slate-300/70"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {user?.greeting || 'Welcome'}
                </motion.p>
                <motion.h1
                    className="mt-2 text-3xl font-semibold text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    {user?.name || 'Focus Explorer'}
                </motion.h1>
                <motion.p
                    className="mt-2 text-sm text-slate-300/70"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Tonight you have a {completionRate}% momentum score.
                </motion.p>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative">
                    <svg className="h-16 w-16 -rotate-90" viewBox="0 0 120 120">
                        <circle
                            cx="60"
                            cy="60"
                            r="52"
                            stroke="rgba(148, 163, 184, 0.2)"
                            strokeWidth="10"
                            fill="none"
                        />
                        <motion.circle
                            cx="60"
                            cy="60"
                            r="52"
                            stroke="url(#gradient)"
                            strokeWidth="10"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 52}
                            initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                            animate={{
                                strokeDashoffset:
                                    (2 * Math.PI * 52) * (1 - completionRate / 100),
                            }}
                            transition={{ duration: motionTokens.duration.slow, ease: motionTokens.ease.soft }}
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="50%" stopColor="#38bdf8" />
                                <stop offset="100%" stopColor="#34d399" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
                        {completionRate}%
                    </span>
                </div>

                <ThemeToggle darkMode={darkMode} onToggle={onThemeToggle} />
            </div>
        </motion.header>
    );
};

export default AnimatedHeader;
