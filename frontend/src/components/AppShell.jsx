import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import AnimatedHeader from './AnimatedHeader';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import EmptyState from './EmptyState';
import { motionTokens } from './MotionConfig';

const AppShell = ({ user, todos, onAdd, onToggle, onDelete, darkMode, onThemeToggle }) => {
    const completionRate = useMemo(() => {
        if (!todos.length) {
            return 0;
        }
        const completed = todos.filter((todo) => todo.completed).length;
        return Math.round((completed / todos.length) * 100);
    }, [todos]);

    return (
        <motion.section
            layoutId="app-shell"
            className="relative min-h-screen px-6 py-10 md:px-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: motionTokens.duration.medium }}
        >
            <div className="absolute inset-0 aurora-gradient" />
            <div className="noise-layer" />

            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8">
                <AnimatedHeader
                    user={user}
                    completionRate={completionRate}
                    darkMode={darkMode}
                    onThemeToggle={onThemeToggle}
                />

                <motion.div
                    className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: motionTokens.duration.medium }}
                >
                    <div className="space-y-6">
                        <TodoInput onAdd={onAdd} />
                        {todos.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <TodoList todos={todos} onToggle={onToggle} onDelete={onDelete} />
                        )}
                    </div>
                    <motion.aside
                        className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-2xl"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: motionTokens.duration.medium }}
                    >
                        <h3 className="text-sm uppercase tracking-[0.3em] text-slate-300/70">
                            Focus ritual
                        </h3>
                        <p className="mt-3 text-lg font-semibold text-white">
                            A calm space for deliberate progress.
                        </p>
                        <p className="mt-3 text-sm text-slate-300/70">
                            Each task is a scene. Let them enter softly, exit gracefully, and reward you with quiet momentum.
                        </p>
                        <motion.div
                            className="mt-6 rounded-[20px] border border-white/10 bg-white/5 p-4"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-300/60">Next mood</p>
                            <p className="mt-2 text-sm text-white">Soft focus & cinematic glow</p>
                        </motion.div>
                    </motion.aside>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default AppShell;
