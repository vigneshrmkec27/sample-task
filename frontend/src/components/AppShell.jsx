import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AnimatedHeader from './AnimatedHeader';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import EmptyState from './EmptyState';
import ThemeToggle from './ThemeToggle';
import { fadeUp, MOTION_TOKENS, stagger } from './MotionConfig';

function AppShell({ user, todos, setTodos, progress, darkMode, onToggleTheme }) {
    const handleAdd = (title, description) => {
        setTodos((prev) => [
            {
                id: `todo-${Date.now()}`,
                title,
                description,
                completed: false,
            },
            ...prev,
        ]);
    };

    const handleToggle = (id) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const handleDelete = (id) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };

    return (
        <motion.div
            className="relative min-h-screen overflow-hidden"
            initial="hidden"
            animate="show"
            variants={stagger}
        >
            <div className="absolute inset-0 animated-gradient" />
            <div className="absolute inset-0 bg-slate-950/70" />

            <motion.div
                className="absolute right-0 top-20 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-[140px]"
                animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
                <motion.div variants={fadeUp}>
                    <AnimatedHeader user={user} progress={progress} />
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className="flex flex-col gap-6 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.5)] backdrop-blur-2xl">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                                    Today’s focus
                                </p>
                                <h3 className="text-2xl font-semibold text-white">
                                    Your cinematic task flow
                                </h3>
                            </div>
                            <ThemeToggle darkMode={darkMode} onToggleTheme={onToggleTheme} />
                        </div>
                        <TodoInput onAdd={handleAdd} />
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {todos.length === 0 ? (
                        <motion.div
                            key="empty"
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <EmptyState />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <TodoList
                                todos={todos}
                                onToggle={handleToggle}
                                onDelete={handleDelete}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    className="group fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-900 shadow-[0_20px_50px_rgba(59,130,246,0.4)]"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ boxShadow: ['0 0 0 rgba(59,130,246,0)', '0 0 40px rgba(59,130,246,0.6)', '0 0 0 rgba(59,130,246,0)'] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: MOTION_TOKENS.easeSoft }}
                >
                    <span className="text-2xl">+</span>
                </motion.button>
            </div>
        </motion.div>
    );
}

export default AppShell;
