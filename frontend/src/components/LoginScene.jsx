import React, { useMemo, useState } from 'react';
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring
} from 'framer-motion';
import { motionTokens } from './MotionConfig';

const LoginScene = ({ onSuccess }) => {
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [error, setError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ripple, setRipple] = useState({ x: 0, y: 0, key: 0 });

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 120, damping: 15, mass: 0.4 });
    const springY = useSpring(y, { stiffness: 120, damping: 15, mass: 0.4 });
    const prefersReducedMotion = useReducedMotion();

    const ambientParticles = useMemo(
        () => Array.from({ length: 6 }, (_, index) => index),
        []
    );

    /* ---------------- Handlers ---------------- */
    const handleChange = (e) => {
        setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formState.email || !formState.password) {
            setError(true);
            return;
        }

        setError(false);
        setIsSubmitting(true);

        setTimeout(() => {
            onSuccess({
                name: formState.email.split('@')[0] || 'Guest'
            });
        }, 900);
    };

    const handlePointerMove = (e) => {
        const b = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - b.left - b.width / 2) * 0.15);
        y.set((e.clientY - b.top - b.height / 2) * 0.15);
    };

    const handlePointerLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleRipple = (e) => {
        const b = e.currentTarget.getBoundingClientRect();
        setRipple({
            x: e.clientX - b.left,
            y: e.clientY - b.top,
            key: Date.now()
        });
    };

    /* ================= UI ================= */
    return (
        <motion.section
            className="relative flex min-h-screen items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.duration.medium }}
        >
            <div className="absolute inset-0 aurora-gradient" />
            <div className="noise-layer" />

            {/* Ambient particles */}
            {ambientParticles.map(p => (
                <motion.span
                    key={`particle-${p}`}
                    className="absolute h-28 w-28 rounded-full bg-white/10 blur-3xl"
                    style={{
                        top: `${15 + p * 14}%`,
                        right: `${10 + p * 8}%`
                    }}
                    animate={
                        prefersReducedMotion
                            ? { opacity: 0.25 }
                            : { y: [0, -24, 0], opacity: [0.15, 0.35, 0.2] }
                    }
                    transition={{
                        duration: 9 + p,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
            ))}

            {/* Card */}
            <motion.div
                layoutId="auth-shell"
                className="relative z-10 w-full max-w-md rounded-[36px] border border-white/10 bg-white/10 p-10 shadow-[0_30px_80px_rgba(15,23,42,0.4)] backdrop-blur-2xl"
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={motionTokens.spring.medium}
            >
                {/* Header */}
                <motion.div
                    className="mb-8 space-y-3 text-center"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.1,
                        duration: motionTokens.duration.medium
                    }}
                >
                    <p className="text-xs uppercase tracking-[0.3em] text-indigo-200/70">
                        Welcome back
                    </p>
                    <h2 className="text-3xl font-semibold text-white">
                        Continue the calm
                    </h2>
                    <p className="text-sm text-slate-200/70">
                        Sign in to let your tasks flow into focus.
                    </p>
                </motion.div>

                {/* Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {['email', 'password'].map(field => (
                        <motion.label
                            key={field}
                            className="block text-xs uppercase tracking-[0.3em] text-slate-300/60"
                            animate={error ? { x: [0, -6, 6, -6, 0] } : { x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <motion.div
                                className="relative mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                                initial="rest"
                                whileFocusWithin="focus"
                                variants={{
                                    rest: { scale: 1 },
                                    focus: { scale: 1.01 }
                                }}
                            >
                                <input
                                    type={field === 'password' ? 'password' : 'email'}
                                    name={field}
                                    value={formState[field]}
                                    onChange={handleChange}
                                    autoComplete={
                                        field === 'password'
                                            ? 'current-password'
                                            : 'email'
                                    }
                                    placeholder=" "
                                    className="peer w-full bg-transparent text-sm text-white placeholder:text-transparent focus:outline-none"
                                />
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs tracking-[0.3em] text-slate-300/60 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-indigo-200">
                                    {field}
                                </span>
                                <motion.span
                                    className="mt-4 block h-[2px] w-full origin-left rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400"
                                    variants={{ rest: { scaleX: 0 }, focus: { scaleX: 1 } }}
                                    transition={{ duration: motionTokens.duration.fast }}
                                />
                            </motion.div>
                        </motion.label>
                    ))}

                    {/* Submit */}
                    <motion.button
                        type="submit"
                        layoutId="app-shell"
                        className="relative mt-6 flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-lg"
                        style={{ x: springX, y: springY }}
                        onPointerMove={handlePointerMove}
                        onPointerLeave={handlePointerLeave}
                        onPointerDown={handleRipple}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={motionTokens.spring.snappy}
                    >
                        <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-indigo-500/40 via-sky-400/30 to-emerald-400/40 opacity-0"
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: motionTokens.duration.fast }}
                        />
                        <AnimatePresence>
                            <motion.span
                                key={ripple.key}
                                className="absolute h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20"
                                style={{ left: ripple.x, top: ripple.y }}
                                initial={{ scale: 0, opacity: 0.6 }}
                                animate={{ scale: 1.2, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                            />
                        </AnimatePresence>
                        <span className="relative z-10 flex items-center gap-3">
                            {isSubmitting ? (
                                <>
                                    <motion.span
                                        className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 0.8,
                                            ease: 'linear'
                                        }}
                                    />
                                    Opening…
                                </>
                            ) : (
                                'Enter workspace'
                            )}
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
