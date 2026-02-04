import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import AnimatedSplash from './components/AnimatedSplash';
import LoginScene from './components/LoginScene';
import AppShell from './components/AppShell';
import { MotionConfig, motionTokens } from './components/MotionConfig';

const initialTodos = [
    { id: 1, title: 'Design cinematic entry flow', completed: true },
    { id: 2, title: 'Refine motion rhythm', completed: false },
    { id: 3, title: 'Add delightful empty state', completed: false },
];

const App = () => {
    const [stage, setStage] = useState('splash');
    const [user, setUser] = useState(null);
    const [todos, setTodos] = useState(initialTodos);
    const [darkMode, setDarkMode] = useState(true);
    const [transitioning, setTransitioning] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStage('login');
        }, 2600);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            return 'Good morning';
        }
        if (hour < 18) {
            return 'Good afternoon';
        }
        return 'Good evening';
    }, []);

    const handleLoginSuccess = (profile) => {
        setTransitioning(true);
        setTimeout(() => {
            setUser(profile);
            setStage('app');
            setTransitioning(false);
        }, 900);
    };

    const handleAddTodo = (title) => {
        setTodos((prev) => [
            { id: Date.now(), title, completed: false },
            ...prev,
        ]);
    };

    const handleToggleTodo = (id) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const handleDeleteTodo = (id) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };

    return (
        <MotionConfig>
            <LayoutGroup>
                <div className="min-h-screen bg-[#05060b] text-white">
                    <AnimatePresence mode="wait">
                        {stage === 'splash' && (
                            <AnimatedSplash key="splash" onComplete={() => setStage('login')} />
                        )}

                        {stage === 'login' && (
                            <LoginScene key="login" onSuccess={handleLoginSuccess} />
                        )}

                        {stage === 'app' && (
                            <AppShell
                                key="app"
                                user={{ ...user, greeting }}
                                todos={todos}
                                onAdd={handleAddTodo}
                                onToggle={handleToggleTodo}
                                onDelete={handleDeleteTodo}
                                darkMode={darkMode}
                                onThemeToggle={() => setDarkMode((prev) => !prev)}
                            />
                        )}
                    </AnimatePresence>

                    {transitioning && (
                        <motion.div
                            className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                layoutId="app-shell"
                                className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400 shadow-2xl"
                                animate={{ scale: [1, 16] }}
                                transition={{ duration: motionTokens.duration.medium, ease: motionTokens.ease.smooth }}
                            />
                        </motion.div>
                    )}
                </div>
            </LayoutGroup>
        </MotionConfig>
    );
};

export default App;
