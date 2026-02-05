import React, { useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Lottie from 'lottie-react';
import { authService } from '../services/authService';
import orbAnimation from '../assets/orb-lottie.json';

const MorphingSparkIcon = () => (
    <motion.svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-indigo-200"
    >
        <motion.path
            d="M12 2 L14.8 8.4 L22 9.2 L16.6 13.8 L18.2 21 L12 17.6 L5.8 21 L7.4 13.8 L2 9.2 L9.2 8.4 Z"
            stroke="currentColor"
            strokeWidth="1.4"
            animate={{
                d: [
                    'M12 2 L14.8 8.4 L22 9.2 L16.6 13.8 L18.2 21 L12 17.6 L5.8 21 L7.4 13.8 L2 9.2 L9.2 8.4 Z',
                    'M12 3 L15.2 8.8 L21 10.2 L16.2 14.2 L17.4 20 L12 17.2 L6.6 20 L7.8 14.2 L3 10.2 L8.8 8.8 Z'
                ]
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
    </motion.svg>
);

const Login = ({ onLoginSuccess, onSwitchToRegister, showNotification }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [ripple, setRipple] = useState({ x: 0, y: 0, key: 0 });

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 140, damping: 16, mass: 0.5 });
    const springY = useSpring(y, { stiffness: 140, damping: 16, mass: 0.5 });
    const prefersReducedMotion = useReducedMotion();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.login(
                formData.username,
                formData.password
            );
            showNotification('Login successful!');
            onLoginSuccess(response);
        } catch (error) {
            showNotification(error.response?.data || 'Invalid credentials', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePointerMove = (event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const offsetX = event.clientX - bounds.left - bounds.width / 2;
        const offsetY = event.clientY - bounds.top - bounds.height / 2;
        x.set(offsetX * 0.2);
        y.set(offsetY * 0.2);
    };

    const handlePointerLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleRipple = (event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        setRipple({
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top,
            key: Date.now(),
        });
    };

    return (
        <div className="min-h-screen flex overflow-hidden">
            {/* LEFT — FORM */}
            <div className="w-full lg:w-[45%] flex items-center justify-center px-10 bg-[#0b0f1d] text-white z-10 relative overflow-hidden">
                <div className="absolute inset-0 futuristic-gradient opacity-90" />
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-[120px] blob-drift" />
                <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-400/20 blur-[140px] blob-drift" />

                <motion.div
                    className="relative w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-10 shadow-[0_30px_70px_rgba(15,23,42,0.45)] backdrop-blur-2xl"
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-indigo-200/70">Secure sign in</p>
                            <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center neon-ring">
                            <MorphingSparkIcon />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <label className="relative block">
                            <input
                                type="text"
                                placeholder=" "
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                                disabled={loading}
                                className="peer w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white placeholder:text-transparent focus:border-indigo-400/60 focus:outline-none"
                            />
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-300 transition-all peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-200">
                                Username
                            </span>
                        </label>

                        <label className="relative block">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder=" "
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                disabled={loading}
                                className="peer w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 pr-16 text-sm text-white placeholder:text-transparent focus:border-indigo-400/60 focus:outline-none"
                            />
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-300 transition-all peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-200">
                                Password
                            </span>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition"
                                tabIndex={-1}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </label>

                        <div className="text-right text-xs text-slate-400 hover:text-indigo-200 cursor-pointer">
                            Forgot Password?
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
                            style={{ x: springX, y: springY }}
                            onPointerMove={handlePointerMove}
                            onPointerLeave={handlePointerLeave}
                            onPointerDown={handleRipple}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/40 via-sky-400/30 to-emerald-400/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
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
                                {loading ? (
                                    <>
                                        <motion.span
                                            className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                        />
                                        Signing in…
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </span>
                        </motion.button>
                    </form>

                    <p className="mt-8 text-center text-slate-400 text-sm">
                        Not a member?{' '}
                        <button
                            onClick={onSwitchToRegister}
                            className="font-semibold text-white hover:text-indigo-200"
                        >
                            Register now
                        </button>
                    </p>
                </motion.div>
            </div>

            {/* RIGHT — PREMIUM ABSTRACT PANEL */}
            <div className="hidden lg:flex w-[55%] relative items-center justify-center bg-[#05060b] overflow-hidden">
                <div className="absolute inset-0 aurora-gradient" />
                <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-purple-500/30 blur-[140px] blob-drift" />
                <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-emerald-400/20 blur-[160px] blob-drift" />

                <div className="relative z-10 max-w-lg text-center px-12 text-white">
                    <div className="glass-panel rounded-3xl p-10 mb-10 border border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-indigo-200/70">Momentum</p>
                                <h3 className="text-xl font-semibold">Project sync</h3>
                            </div>
                            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                <MorphingSparkIcon />
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <Lottie
                                animationData={orbAnimation}
                                loop
                                autoplay={!prefersReducedMotion}
                                className="h-44 w-44"
                            />
                        </div>
                    </div>

                    <h2 className="text-3xl font-semibold mb-3">Make your work effortless</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Organize tasks, track progress, and stay focused with cinematic clarity.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
