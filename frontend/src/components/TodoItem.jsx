import React from 'react';
import { motion } from 'framer-motion';
import { MOTION_TOKENS } from './MotionConfig';

function TodoItem({ todo, onToggle, onDelete }) {
    return (
        <motion.li
            layout
            className="group flex flex-col gap-3 rounded-[24px] border border-white/10 bg-white/5 px-6 py-5 shadow-[0_20px_40px_rgba(15,23,42,0.35)]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={MOTION_TOKENS.spring}
        >
            <div className="flex items-start justify-between gap-4">
                <button
                    className="flex items-start gap-4 text-left"
                    onClick={() => onToggle(todo.id)}
                >
                    <motion.span
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5"
                        animate={
                            todo.completed
                                ? { backgroundColor: 'rgba(56,189,248,0.35)', borderColor: 'rgba(56,189,248,0.6)' }
                                : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }
                        }
                        transition={MOTION_TOKENS.spring}
                    >
                        <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <motion.path
                                d="M5 12.5l4 4L19 7"
                                stroke="white"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={false}
                                animate={{ pathLength: todo.completed ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.svg>
                    </motion.span>
                    <div>
                        <h4
                            className={`text-base font-semibold ${
                                todo.completed ? 'text-slate-300 line-through' : 'text-white'
                            }`}
                        >
                            {todo.title}
                        </h4>
                        <p className="mt-1 text-sm text-slate-400">{todo.description}</p>
                    </div>
                </button>
                <motion.button
                    onClick={() => onDelete(todo.id)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Delete
                </motion.button>
            </div>
            {todo.completed && (
                <motion.div
                    className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    Celebration unlocked ✨
                </motion.div>
            )}
        </motion.li>
    );
}

export default TodoItem;
