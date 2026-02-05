import React, { useMemo, useState } from 'react';
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring
} from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Lottie from 'lottie-react';
import { authService } from '../services/authService';
import orbAnimation from '../assets/orb-lottie.json';

const strengthMeta = [
    { label: 'Weak', color: 'bg-rose-500' },
    { label: 'Fair', color: 'bg-amber-400' },
    { label: 'Strong', color: 'bg-emerald-400' },
    { label: 'Elite', color: 'bg-indigo-400' }
];

const Register = ({ onRegisterSuccess, onSwitchToLogin, showNotification }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(0);

    const blobX = useMotionValue(0);
    const blobY = useMotionValue(0);
    const blobXSpring = useSpring(blobX, { stiffness: 120, damping: 18 });
    const blobYSpring = useSpring(blobY, { stiffness: 120, damping: 18 });
    const prefersReducedMotion = useReducedMotion();

    const steps = useMemo(
        () => [
            { title: 'Account details', description: 'Let’s set up the essentials.' },
            { title: 'Secure access', description: 'Choose a strong password.' }
        ],
        []
    );

    const strengthScore = useMemo(() => {
        let score = 0;
        if (formData.password.length >= 6) score++;
        if (/[A-Z]/.test(formData.password)) score++;
        if (/[0-9]/.test(formData.password)) score++;
        if (/[^A-Za-z0-9]/.test(formData.password)) score++;
        return Math.min(score, 3);
    }, [formData.password]);

    const strength = strengthMeta[strengthScore];
    const progress = ((step + 1) / steps.length) * 100;

    /* ---------------- Handlers ---------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (formData.password.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        setLoading(true);
        try {
            await authService.register(
                formData.username,
                formData.email,
                formData.password
            );
            showNotification('Registration successful! Please login.');
            onRegisterSuccess();
        } catch (error) {
            const msg = error.response?.data || 'Registration failed';
            if (typeof msg === 'string' && msg.toLowerCase().includes('exists')) {
                showNotification('User already exists', 'error');
            } else {
                showNotification(msg, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (step === 0 && (!formData.username || !formData.email)) {
            showNotification('Please enter a username and email', 'error');
            return;
        }
        setStep(prev => Math.min(prev + 1, steps.length - 1));
    };

    const handlePrev = () => {
        setStep(prev => Math.max(prev - 1, 0));
    };

    const handlePointerMove = (e) => {
        const b = e.currentTarget.getBoundingClientRect();
        blobX.set((e.clientX - b.left - b.width / 2) * 0.08);
        blobY.set((e.clientY - b.top - b.height / 2) * 0.08);
    };

    /* ================= UI ================= */
    return (
        <div className="min-h-screen flex overflow-hidden">
            {/* LEFT — REGISTER */}
            <div className="w-full lg:w-[45%] flex items-center justify-center px-10 bg-[#0b0f1d] text-white relative overflow-hidden z-10">
                <div className="absolute inset-0 futuristic-gradient opacity-90" />
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-[120px] blob-drift" />
                <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-400/20 blur-[140px] blob-drift" />

                <motion.div
                    className="relative w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-10 shadow-[0_30px_70px_rgba(15,23,42,0.45)] backdrop-blur-2xl"
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-indigo-200/70">
                                Create account
                            </p>
                            <h1 className="text-3xl font-semibold tracking-tight">
                                Join the flow
                            </h1>
                            <p className="text-sm text-slate-400 mt-2">
                                {steps[step].description}
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                            <span className="text-xs uppercase tracking-[0.2em] text-indigo-200">
                                {step + 1}/{steps.length}
                            </span>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-6">
                        <div className="flex justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                            <span>{steps[step].title}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                            <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400"
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.6 }}
                            />
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {step === 0 && (
                                <motion.div
                                    key="step-1"
                                    className="space-y-5"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <label className="relative block">
                                        <input
                                            type="text"
                                            placeholder=" "
                                            value={formData.username}
                                            onChange={e =>
                                                setFormData({ ...formData, username: e.target.value })
                                            }
                                            className="peer w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white placeholder:text-transparent focus:border-indigo-400/60 focus:outline-none"
                                        />
                                        <span className="floating-label">Username</span>
                                    </label>

                                    <label className="relative block">
                                        <input
                                            type="email"
                                            placeholder=" "
                                            value={formData.email}
                                            onChange={e =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                            className="peer w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white placeholder:text-transparent focus:border-indigo-400/60 focus:outline-none"
                                        />
                                        <span className="floating-label">Email</span>
                                    </label>
                                </motion.div>
                            )}

                            {step === 1 && (
                                <motion.div
                                    key="step-2"
                                    className="space-y-5"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <label className="relative block">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder=" "
                                            value={formData.password}
                                            onChange={e =>
                                                setFormData({ ...formData, password: e.target.value })
                                            }
                                            className="peer w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 pr-16 text-sm text-white placeholder:text-transparent focus:border-indigo-400/60 focus:outline-none"
                                        />
                                        <span className="floating-label">Password</span>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(p => !p)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </label>

                                    <div>
                                        <div className="flex justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                                            <span>Password strength</span>
                                            <span>{strength.label}</span>
                                        </div>
                                        <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                                            <motion.div
                                                className={`h-full rounded-full ${strength.color}`}
                                                animate={{ width: `${(strengthScore + 1) * 25}%` }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Actions */}
                        <div className="flex justify-between items-center">
                            <button
                                type="button"
                                onClick={handlePrev}
                                disabled={step === 0}
                                className="text-xs uppercase tracking-[0.3em] text-slate-400 disabled:opacity-40"
                            >
                                Back
                            </button>

                            {step < steps.length - 1 ? (
                                <motion.button
                                    type="button"
                                    onClick={handleNext}
                                    className="rounded-full border border-white/10 bg-white/10 px-6 py-2 text-xs uppercase tracking-[0.3em]"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Next
                                </motion.button>
                            ) : (
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-full border border-white/10 bg-white/10 px-6 py-2 text-xs uppercase tracking-[0.3em] disabled:opacity-50"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loading ? 'Creating…' : 'Create account'}
                                </motion.button>
                            )}
                        </div>
                    </form>

                    <p className="mt-8 text-center text-slate-400 text-sm">
                        Already have an account?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="font-semibold text-white hover:text-indigo-200"
                        >
                            Sign in
                        </button>
                    </p>
                </motion.div>
            </div>

            {/* RIGHT — VISUAL */}
            <div
                className="hidden lg:flex w-[55%] relative items-center justify-center overflow-hidden bg-[#05060b]"
                onPointerMove={handlePointerMove}
            >
                <div className="absolute inset-0 aurora-gradient" />

                <motion.div
                    className="absolute w-[520px] h-[520px] rounded-full bg-emerald-400/20 blur-[140px]"
                    style={{ x: blobXSpring, y: blobYSpring }}
                />
                <motion.div
                    className="absolute w-[420px] h-[420px] rounded-full bg-indigo-500/30 blur-[160px]"
                    style={{ x: blobXSpring, y: blobYSpring }}
                />

                <div className="relative z-10 max-w-lg text-center px-12 text-white">
                    <div className="rounded-3xl p-10 mb-12 border border-white/10 backdrop-blur-2xl">
                        <Lottie
                            animationData={orbAnimation}
                            loop
                            autoplay={!prefersReducedMotion}
                            className="h-44 w-44 mx-auto"
                        />
                    </div>

                    <h2 className="text-3xl font-semibold mb-3">
                        Everything you need to stay productive
                    </h2>
                    <p className="text-slate-300 leading-relaxed">
                        Plan smarter, work faster, and keep your focus where it matters.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
