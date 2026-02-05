import React from 'react';
import { motion } from 'framer-motion';
import { MOTION_TOKENS } from './MotionConfig';

function ThemeToggle({ darkMode, onToggleTheme }) {
    return (
        <motion.button
            onClick={onToggleTheme}
            className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-200"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={MOTION_TOKENS.spring}
        >
            <span>{darkMode ? 'Dark' : 'Light'}</span>
            <motion.span
                className="relative flex h-6 w-10 items-center rounded-full bg-white/10"
                animate={{ backgroundColor: darkMode ? 'rgba(56,189,248,0.3)' : 'rgba(148,163,184,0.3)' }}
                transition={MOTION_TOKENS.springGentle}
            >
                <motion.span
                    className="absolute h-5 w-5 rounded-full bg-white"
                    animate={{ x: darkMode ? 18 : 2 }}
                    transition={MOTION_TOKENS.springGentle}
                />
            </motion.span>
        </motion.button>
    );
}

export default ThemeToggle;
