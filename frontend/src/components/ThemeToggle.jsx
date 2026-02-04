import React from 'react';
import { motion } from 'framer-motion';
import { motionTokens } from './MotionConfig';

const ThemeToggle = ({ darkMode, onToggle }) => {
    return (
        <motion.button
            type="button"
            onClick={onToggle}
            className="relative flex h-10 w-20 items-center rounded-full border border-white/10 bg-white/10 p-1 shadow-inner"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={motionTokens.spring.soft}
        >
            <motion.span
                className="absolute left-2 text-[10px] uppercase tracking-[0.2em] text-slate-300/60"
                animate={{ opacity: darkMode ? 0 : 1 }}
            >
                Light
            </motion.span>
            <motion.span
                className="absolute right-2 text-[10px] uppercase tracking-[0.2em] text-slate-300/60"
                animate={{ opacity: darkMode ? 1 : 0 }}
            >
                Dark
            </motion.span>
            <motion.div
                className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 via-sky-400 to-emerald-400 shadow-lg"
                animate={{ x: darkMode ? 36 : 0 }}
                transition={motionTokens.spring.snappy}
            />
        </motion.button>
    );
};

export default ThemeToggle;
