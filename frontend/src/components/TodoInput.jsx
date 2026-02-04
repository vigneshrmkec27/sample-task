import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { motionTokens } from './MotionConfig';

const TodoInput = ({ onAdd }) => {
    const [value, setValue] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!value.trim()) {
            return;
        }
        onAdd(value.trim());
        setValue('');
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="relative flex items-center gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionTokens.duration.medium }}
            layout
        >
            <div className="flex-1">
                <label className="text-xs uppercase tracking-[0.3em] text-slate-400/70">
                    New intention
                </label>
                <input
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder="Describe the next moment..."
                    className="mt-2 w-full bg-transparent text-lg text-white placeholder:text-slate-400 focus:outline-none"
                />
                <motion.span
                    className="mt-3 block h-[2px] w-full origin-left rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: value ? 1 : 0.2 }}
                    transition={{ duration: motionTokens.duration.fast }}
                />
            </div>
            <motion.button
                type="submit"
                className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400 text-xl text-white shadow-lg"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                transition={motionTokens.spring.snappy}
            >
                +
                <motion.span
                    className="absolute inset-0 rounded-full border border-white/30"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                />
            </motion.button>
        </motion.form>
    );
};

export default TodoInput;
