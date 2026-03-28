import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2, Sparkles, Zap, Trophy } from 'lucide-react';
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

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';

    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';

    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';

    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';

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
      const result = await register(form.name.trim(), form.email, form.password);
      if (result?.welcomeEmailSent) {
        toast.success("Account created! Welcome email sent. Let's set up your profile.");
      } else {
        const reason = result?.welcomeEmailMessage || 'email-not-sent';
        toast.success("Account created! Let's set up your profile.");
        toast.error(`Email not sent yet (${reason}). You can continue and resend later.`);
      }
      navigate('/onboarding');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Registration failed. Please try again.';
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const p = form.password;
    if (!p) return null;
    let strength = 0;
    if (p.length >= 8) strength++;
    if (/[A-Z]/.test(p)) strength++;
    if (/[0-9]/.test(p)) strength++;
    if (/[^A-Za-z0-9]/.test(p)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left Side - Decorative */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="hidden lg:flex flex-col justify-center w-1/2 p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #141728 0%, #101525 45%, #0a2633 100%)',
        }}
      >
        {/* Background decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#06b6d4]/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#7c3aed]/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#06b6d4]/10 blur-2xl" />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative z-10 mb-14">
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
          className="relative z-10 space-y-7 max-w-xl"
        >
          <div className="space-y-4">
            <motion.h1
              variants={itemVariants}
              className="text-5xl font-bold text-white leading-[1.1]"
            >
              Start your{' '}
              <span className="bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] bg-clip-text text-transparent">
                placement journey
              </span>{' '}
              today
            </motion.h1>
            <motion.p variants={itemVariants} className="text-gray-300 text-lg leading-relaxed">
              Build confidence with guided DSA practice, mock interviews, and resume tools.
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="space-y-3">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#06b6d4]/20 to-[#7c3aed]/20 border border-[#06b6d4]/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#7c3aed]" />
                  </div>
                  <span className="text-gray-200 text-sm">{feature.text}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

      </motion.div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-md my-auto"
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
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                Create your account
              </h2>
              <p className="text-[var(--text-secondary)] text-sm">
                Start your placement preparation for free
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
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text-secondary)]">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name"
                    autoComplete="name"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-[var(--text-primary)] bg-white/5 placeholder:text-[var(--text-secondary)] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#7c3aed]/40 ${
                      errors.name
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-white/10 focus:border-[#7c3aed]/50'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
              </div>

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
                {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
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
                    autoComplete="new-password"
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
                {/* Password Strength */}
                {form.password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            passwordStrength >= level
                              ? strengthColors[passwordStrength]
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Strength:{' '}
                      <span
                        className={
                          passwordStrength === 4
                            ? 'text-green-500'
                            : passwordStrength === 3
                            ? 'text-yellow-400'
                            : 'text-red-400'
                        }
                      >
                        {strengthLabels[passwordStrength]}
                      </span>
                    </p>
                  </div>
                )}
                {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text-secondary)]">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm text-[var(--text-primary)] bg-white/5 placeholder:text-[var(--text-secondary)] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#7c3aed]/40 ${
                      errors.confirmPassword
                        ? 'border-red-500/50 focus:border-red-500'
                        : form.confirmPassword && form.password === form.confirmPassword
                        ? 'border-green-500/50'
                        : 'border-white/10 focus:border-[#7c3aed]/50'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400">{errors.confirmPassword}</p>
                )}
                {!errors.confirmPassword &&
                  form.confirmPassword &&
                  form.password === form.confirmPassword && (
                    <p className="text-xs text-green-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Passwords match
                    </p>
                  )}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-3 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-[var(--text-secondary)]">Already have an account?</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Login Link */}
            <Link
              to="/login"
              className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 border border-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#7c3aed]/50 hover:bg-[#7c3aed]/5 transition-all duration-200"
            >
              Sign in instead
            </Link>
          </div>

          <p className="text-center text-xs text-[var(--text-secondary)] mt-6">
            By creating an account, you agree to our{' '}
            <span className="text-[#7c3aed] cursor-pointer hover:underline">Terms of Service</span>{' '}
            and{' '}
            <span className="text-[#7c3aed] cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
