import React, { useMemo, useState } from 'react';
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
} from 'framer-motion';
import { MOTION_TOKENS } from './MotionConfig';

const inputStyles =
    'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white placeholder:text-slate-400 focus:outline-none';

function LoginScene({ onLoginSuccess }) {
    const reduceMotion = useReducedMotion();
    const [form, setForm] = useState({ email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [focusField, setFocusField] = useState(null);

    // Magnetic hover effect: nudges the CTA toward cursor position for premium feel.
    const magneticX = useSpring(useMotionValue(0), MOTION_TOKENS.springGentle);
    const magneticY = useSpring(useMotionValue(0), MOTION_TOKENS.springGentle);

    const handleChange = (event) => {
        setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
        setError('');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!form.email || !form.password) {
            setError('Enter your credentials to continue.');
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            onLoginSuccess({ name: 'Ava Harper', handle: '@ava' });
        }, 850);
    };

    const buttonLabel = useMemo(
        () => (isSubmitting ? 'Entering…' : 'Enter the workspace'),
        [isSubmitting]
    );

    return (
        <motion.section
            className="relative min-h-screen overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="absolute inset-0 animated-gradient" />
            <div className="absolute inset-0 bg-slate-950/70" />

            <motion.div
                className="absolute -left-24 top-32 h-72 w-72 rounded-full bg-cyan-400/20 blur-[120px]"
                animate={
                    reduceMotion
                        ? { opacity: 0.5 }
                        : { y: [0, -30, 0], opacity: [0.4, 0.7, 0.4] }
                }
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
                <motion.div
                    layoutId="auth-card"
                    className="w-full max-w-lg rounded-[36px] border border-white/10 bg-white/10 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.6)] backdrop-blur-2xl"
                    transition={MOTION_TOKENS.spring}
                >
                    <motion.div layoutId="app-logo" className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                        <span className="text-2xl font-semibold text-white">T</span>
                    </motion.div>
                    <motion.h2
                        className="text-3xl font-semibold"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, ...MOTION_TOKENS.springGentle }}
                    >
                        Welcome back.
                    </motion.h2>
                    <motion.p
                        className="mt-2 text-sm text-slate-300"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, ...MOTION_TOKENS.springGentle }}
                    >
                        Log in to continue the story.
                    </motion.p>

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                        {['email', 'password'].map((field) => (
                            <motion.div
                                key={field}
                                className="relative"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: field === 'email' ? 0.25 : 0.35, ...MOTION_TOKENS.springGentle }}
                            >
                                <input
                                    className={`${inputStyles}`}
                                    type={field === 'password' ? 'password' : 'email'}
                                    name={field}
                                    value={form[field]}
                                    placeholder={field === 'password' ? 'Password' : 'Email'}
                                    onChange={handleChange}
                                    onFocus={() => setFocusField(field)}
                                    onBlur={() => setFocusField(null)}
                                />
                                <motion.span
                                    className="pointer-events-none absolute inset-x-6 bottom-3 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400"
                                    initial={{ scaleX: 0, opacity: 0 }}
                                    animate={{
                                        scaleX: focusField === field ? 1 : 0,
                                        opacity: focusField === field ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.4, ease: MOTION_TOKENS.easeSoft }}
                                    style={{ transformOrigin: 'left' }}
                                />
                            </motion.div>
                        ))}

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    key="error"
                                    className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200"
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            layoutId="login-button"
                            type="submit"
                            className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-slate-900 shadow-[0_20px_40px_rgba(59,130,246,0.25)]"
                            animate={error ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
                            transition={{ duration: 0.6, ease: MOTION_TOKENS.ease }}
                            style={{ x: magneticX, y: magneticY }}
                            onMouseMove={(event) => {
                                if (reduceMotion) return;
                                const rect = event.currentTarget.getBoundingClientRect();
                                const offsetX = event.clientX - rect.left - rect.width / 2;
                                const offsetY = event.clientY - rect.top - rect.height / 2;
                                magneticX.set(offsetX * 0.12);
                                magneticY.set(offsetY * 0.12);
                            }}
                            onMouseLeave={() => {
                                magneticX.set(0);
                                magneticY.set(0);
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isSubmitting}
                        >
                            <motion.span
                                className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                aria-hidden="true"
                            />
                            <motion.span className="relative z-10">{buttonLabel}</motion.span>
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </motion.section>
    );
}

export default LoginScene;
