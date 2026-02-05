import React from 'react';
import { motion } from 'framer-motion';
import { MOTION_TOKENS } from './MotionConfig';

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center gap-6 rounded-[32px] border border-white/10 bg-white/5 px-10 py-16 text-center shadow-[0_30px_80px_rgba(15,23,42,0.4)]">
            <motion.div
                className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/10"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: MOTION_TOKENS.easeSoft }}
            >
                <span className="text-3xl">✨</span>
            </motion.div>
            <div>
                <h3 className="text-2xl font-semibold text-white">Your scene is clear.</h3>
                <p className="mt-2 text-sm text-slate-300">
                    Add a task to begin your next cinematic moment.
                </p>
            </div>
            <motion.div
                className="h-2 w-32 rounded-full bg-gradient-to-r from-cyan-400/40 via-indigo-400/40 to-fuchsia-400/40"
                animate={{ scaleX: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: MOTION_TOKENS.easeSoft }}
                style={{ transformOrigin: 'center' }}
            />
        </div>
    );
}

export default EmptyState;
