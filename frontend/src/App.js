import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AnimatedSplash from './components/AnimatedSplash';
import LoginScene from './components/LoginScene';
import AppShell from './components/AppShell';
import { MotionConfigProvider, MOTION_TOKENS } from './components/MotionConfig';

const initialTodos = [
    {
        id: 'todo-1',
        title: 'Design the cinematic login flow',
        description: 'Shared layout morphs and magnetic hover effect.',
        completed: true,
    },
    {
        id: 'todo-2',
        title: 'Animate todo list entrance',
        description: 'Spring in, staggered, with soft glow.',
        completed: false,
    },
    {
        id: 'todo-3',
        title: 'Polish empty state illustration',
        description: 'Breathing motion and micro-copy.',
        completed: false,
    },
];

function App() {
    const [phase, setPhase] = useState('splash');
    const [todos, setTodos] = useState(initialTodos);
    const [darkMode, setDarkMode] = useState(true);
    const [user, setUser] = useState({ name: 'Ava', handle: '@ava' });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    const progress = useMemo(() => {
        if (todos.length === 0) return 0;
        return Math.round(
            (todos.filter((todo) => todo.completed).length / todos.length) * 100
        );
    }, [todos]);

    const handleLogin = (profile) => {
        setUser(profile);
        setPhase('app');
    };

    return (
        <MotionConfigProvider>
            <div className="min-h-screen bg-slate-950 text-white">
                <AnimatePresence mode="wait">
                    {phase === 'splash' && (
                        <AnimatedSplash key="splash" onComplete={() => setPhase('login')} />
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {phase === 'login' && (
                        <LoginScene key="login" onLoginSuccess={handleLogin} />
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {phase === 'app' && (
                        <motion.div
                            key="app"
                            layoutId="login-button"
                            className="min-h-screen"
                            transition={MOTION_TOKENS.spring}
                        >
                            <AppShell
                                user={user}
                                todos={todos}
                                setTodos={setTodos}
                                progress={progress}
                                darkMode={darkMode}
                                onToggleTheme={() => setDarkMode((prev) => !prev)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </MotionConfigProvider>
    );
}

export default App;
