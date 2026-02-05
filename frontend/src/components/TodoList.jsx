import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TodoItem from './TodoItem';
import { stagger } from './MotionConfig';

function TodoList({ todos, onToggle, onDelete }) {
    return (
        <motion.ul
            className="grid gap-4"
            variants={stagger}
            initial="hidden"
            animate="show"
        >
            <AnimatePresence>
                {todos.map((todo) => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={onToggle}
                        onDelete={onDelete}
                    />
                ))}
            </AnimatePresence>
        </motion.ul>
    );
}

export default TodoList;
