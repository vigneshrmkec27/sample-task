import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MOTION_TOKENS } from './MotionConfig';

function TodoInput({ onAdd }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!title.trim()) return;
        onAdd(title.trim(), description.trim());
        setTitle('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
                <motion.input
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white placeholder:text-slate-400"
                    placeholder="What do you want to accomplish?"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    whileFocus={{ scale: 1.01, boxShadow: '0 0 20px rgba(56,189,248,0.25)' }}
                    transition={MOTION_TOKENS.springGentle}
                />
                <motion.input
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white placeholder:text-slate-400"
                    placeholder="Add a detail to keep it vivid"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    whileFocus={{ scale: 1.01, boxShadow: '0 0 20px rgba(59,130,246,0.2)' }}
                    transition={MOTION_TOKENS.springGentle}
                />
            </div>
            <motion.button
                type="submit"
                className="flex items-center justify-center gap-2 self-start rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold text-white"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={MOTION_TOKENS.spring}
            >
                <span className="text-lg">+</span>
                Add todo
            </motion.button>
        </form>
    );
}

export default TodoInput;
