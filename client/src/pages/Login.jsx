import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle2, Sparkles, Zap, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: CheckCircle2, text: 'Track DSA progress across 500+ problems' },
  { icon: Zap, text: 'AI-powered mock interviews with real-time feedback' },
  { icon: Trophy, text: 'Company-specific preparation paths' },
  { icon: Sparkles, text: 'Resume builder with ATS score checker' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const result = await login(form.email, form.password);
      toast.success(`Welcome back, ${result?.user?.name || 'there'}! 🎉`);
      navigate(result?.user?.onboarded ? '/dashboard' : '/onboarding');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Login failed. Please try again.';
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left Side - Decorative */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 50%, #1a1a2e 100%)',
        }}
      >
        {/* Background decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#7c3aed]/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#06b6d4]/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#7c3aed]/10 blur-2xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'linear-gradient(#7c3aed 1px, transparent 1px), linear-gradient(90deg, #7c3aed 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center text-white text-xl shadow-lg shadow-[#7c3aed]/30">
              🎯
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">
              PlacePrep
            </span>
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 space-y-8"
        >
          <div className="space-y-4">
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-bold text-white leading-tight"
            >
              Land your{' '}
              <span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">
                dream job
              </span>{' '}
              with confidence
            </motion.h1>
            <motion.p variants={itemVariants} className="text-gray-400 text-lg leading-relaxed">
              The all-in-one college placement preparation platform trusted by thousands of students.
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="space-y-4">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed]/20 to-[#06b6d4]/20 border border-[#7c3aed]/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#06b6d4]" />
                  </div>
                  <span className="text-gray-300 text-sm">{feature.text}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

      </motion.div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center text-white text-xl shadow-lg shadow-[#7c3aed]/30">
              🎯
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">
              PlacePrep
            </span>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl border border-white/10 p-8 shadow-2xl backdrop-blur-sm"
            style={{
              background: 'var(--bg-card)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Welcome back</h2>
              <p className="text-[var(--text-secondary)] text-sm">
                Sign in to continue your placement journey
              </p>
            </div>

            {/* Error Banner */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {errors.general}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text-secondary)]">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-[var(--text-primary)] bg-white/5 placeholder:text-[var(--text-secondary)] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#7c3aed]/40 ${
                      errors.email
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-white/10 focus:border-[#7c3aed]/50'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text-secondary)]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm text-[var(--text-primary)] bg-white/5 placeholder:text-[var(--text-secondary)] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#7c3aed]/40 ${
                      errors.password
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-white/10 focus:border-[#7c3aed]/50'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-[#7c3aed] hover:text-[#06b6d4] transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-3 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: loading
                    ? 'linear-gradient(135deg, #7c3aed80, #06b6d480)'
                    : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,0.4)',
                }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-[var(--text-secondary)]">New here?</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Register Link */}
            <Link
              to="/register"
              className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 border border-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#7c3aed]/50 hover:bg-[#7c3aed]/5 transition-all duration-200"
            >
              Create a free account
            </Link>
          </div>

          <p className="text-center text-xs text-[var(--text-secondary)] mt-6">
            By signing in, you agree to our{' '}
            <span className="text-[#7c3aed] cursor-pointer hover:underline">Terms of Service</span>{' '}
            and{' '}
            <span className="text-[#7c3aed] cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
