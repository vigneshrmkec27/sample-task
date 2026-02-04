import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TodoItem from './TodoItem';

const TodoList = ({ todos, onToggle, onDelete }) => {
    return (
        <motion.ul layout className="mt-6 space-y-4">
            <AnimatePresence>
                {todos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
                ))}
            </AnimatePresence>
        </motion.ul>
    );
};

export default TodoList;
