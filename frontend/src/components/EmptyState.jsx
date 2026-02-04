import React from 'react';
import { motion } from 'framer-motion';
import { motionTokens } from './MotionConfig';

const EmptyState = () => {
    return (
        <motion.div
            className="mt-10 flex flex-col items-center justify-center rounded-[28px] border border-white/10 bg-white/5 px-8 py-12 text-center shadow-xl backdrop-blur-2xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionTokens.duration.medium }}
            layout
        >
            <motion.div
                className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-indigo-500/40 via-sky-400/30 to-emerald-400/30 text-3xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
                ✨
            </motion.div>
            <h3 className="text-2xl font-semibold text-white">A blank canvas</h3>
            <p className="mt-2 text-sm text-slate-300/70">
                Add your first intention and watch the space come alive.
            </p>
        </motion.div>
    );
};

export default EmptyState;
