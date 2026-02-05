import React, { useMemo, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { motionTokens } from './MotionConfig';

const LoginScene = ({ onSuccess }) => {
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [error, setError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 120, damping: 15, mass: 0.4 });
    const springY = useSpring(y, { stiffness: 120, damping: 15, mass: 0.4 });

    const ambientParticles = useMemo(
        () => Array.from({ length: 5 }, (_, index) => index),
        []
    );

    const handleChange = (event) => {
        setFormState((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!formState.email || !formState.password) {
            setError(true);
            return;
        }
        setError(false);
        setIsSubmitting(true);
        setTimeout(() => {
            onSuccess({
                name: formState.email.split('@')[0] || 'Guest',
            });
        }, 900);
    };

    const handlePointerMove = (event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const offsetX = event.clientX - bounds.left - bounds.width / 2;
        const offsetY = event.clientY - bounds.top - bounds.height / 2;
        x.set(offsetX * 0.15);
        y.set(offsetY * 0.15);
    };

    const handlePointerLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.section
            className="relative flex min-h-screen items-center justify-center overflow-hidden login-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.duration.medium }}
        >
            <div className="absolute inset-0 aurora-gradient" />
            <div className="noise-layer" />

            {ambientParticles.map((particle) => (
                <motion.span
                    key={`login-particle-${particle}`}
                    className="absolute h-28 w-28 rounded-full bg-white/10 blur-3xl"
                    style={{
                        top: `${15 + particle * 14}%`,
                        right: `${10 + particle * 8}%`,
                    }}
                    animate={{ y: [0, -24, 0], opacity: [0.15, 0.35, 0.2] }}
                    transition={{ duration: 9 + particle, repeat: Infinity, ease: 'easeInOut' }}
                />
            ))}

            <motion.div
                layoutId="auth-shell"
                className="relative z-10 w-full max-w-md rounded-[36px] border border-white/10 bg-white/10 p-10 shadow-[0_30px_80px_rgba(15,23,42,0.4)] backdrop-blur-2xl auth-card"
            >
                <motion.div
                    className="mb-8 space-y-3 text-center"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: motionTokens.duration.medium }}
                >
                    <p className="text-xs uppercase tracking-[0.3em] text-indigo-200/70">Welcome back</p>
                    <h2 className="text-3xl font-semibold text-white">Continue the calm</h2>
                    <p className="text-sm text-slate-200/70">
                        Sign in to let your tasks flow into focus.
                    </p>
                </motion.div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {['email', 'password'].map((field) => (
                        <motion.label
                            key={field}
                            className="block text-xs uppercase tracking-[0.3em] text-slate-300/60"
                            initial={false}
                            animate={error ? { x: [0, -6, 6, -6, 0] } : { x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {field}
                            <motion.div
                                className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                                initial="rest"
                                whileFocusWithin="focus"
                                variants={{ rest: { scale: 1 }, focus: { scale: 1.01 } }}
                            >
                                <input
                                    type={field === 'password' ? 'password' : 'email'}
                                    name={field}
                                    value={formState[field]}
                                    onChange={handleChange}
                                    placeholder={`Enter your ${field}`}
                                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none input-animated"
                                />
                                <motion.span
                                    className="mt-3 block h-[2px] w-full origin-left rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400"
                                    variants={{ rest: { scaleX: 0 }, focus: { scaleX: 1 } }}
                                    transition={{ duration: motionTokens.duration.fast }}
                                />
                            </motion.div>
                        </motion.label>
                    ))}

                    <motion.button
                        type="submit"
                        layoutId="app-shell"
                        className="relative mt-6 flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-lg btn-animated"
                        style={{ x: springX, y: springY }}
                        onPointerMove={handlePointerMove}
                        onPointerLeave={handlePointerLeave}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={motionTokens.spring.snappy}
                    >
                        <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-indigo-500/40 via-sky-400/30 to-emerald-400/40 opacity-0"
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: motionTokens.duration.fast }}
                        />
                        <span className="relative z-10">
                            {isSubmitting ? 'Opening...' : 'Enter workspace'}
                        </span>
                    </motion.button>

                    {error && (
                        <motion.p
                            className="text-center text-xs text-rose-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            Please enter both fields to continue.
                        </motion.p>
                    )}
                </form>
            </motion.div>
        </motion.section>
    );
};

export default LoginScene;
