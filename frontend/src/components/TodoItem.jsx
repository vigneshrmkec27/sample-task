import React from 'react';
import { motion } from 'framer-motion';
import { motionTokens } from './MotionConfig';

const TodoItem = ({ todo, onToggle, onDelete }) => {
    return (
        <motion.li
            layout
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={motionTokens.spring.medium}
            className="group flex items-center justify-between gap-4 rounded-[22px] border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-xl"
        >
            <button
                type="button"
                onClick={() => onToggle(todo.id)}
                className="flex items-center gap-4 text-left"
            >
                <motion.span
                    className="relative flex h-6 w-6 items-center justify-center rounded-full border border-white/40"
                    animate={{
                        backgroundColor: todo.completed ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255,255,255,0.1)',
                        borderColor: todo.completed ? 'rgba(99, 102, 241, 1)' : 'rgba(255,255,255,0.4)',
                    }}
                    transition={motionTokens.spring.snappy}
                >
                    <motion.span
                        className="h-3 w-3 rounded-full bg-white"
                        initial={false}
                        animate={{ scale: todo.completed ? 1 : 0 }}
                        transition={motionTokens.spring.soft}
                    />
                </motion.span>
                <div>
                    <p className="text-base font-medium text-white">{todo.title}</p>
                    <motion.p
                        className="text-xs text-slate-300/70"
                        initial={false}
                        animate={{ opacity: todo.completed ? 0.4 : 0.7 }}
                    >
                        {todo.completed ? 'Completed with calm' : 'In progress'}
                    </motion.p>
                </div>
            </button>
            <motion.button
                type="button"
                onClick={() => onDelete(todo.id)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-300/70 opacity-0 transition-opacity group-hover:opacity-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={motionTokens.spring.soft}
            >
                Release
            </motion.button>
        </motion.li>
    );
};

export default TodoItem;
