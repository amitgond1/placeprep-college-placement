import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { GraduationCap, Target, Building2, Settings, ChevronRight, ChevronLeft, Check, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const COMPANIES = ['TCS','Wipro','Infosys','Cognizant','Accenture','Amazon','Google','Microsoft','Flipkart','Razorpay','Zepto','Zoho','Capgemini','HCL','Tech Mahindra','Meta','Apple','Netflix'];
const BRANCHES = ['CSE','IT','ECE','EEE','Mechanical','Civil','Chemical','Biotechnology','Other'];
const YEARS = [2025,2026,2027,2028];
const steps = [
  { label: 'Personal', icon: GraduationCap },
  { label: 'Goals', icon: Target },
  { label: 'Companies', icon: Building2 },
  { label: 'Settings', icon: Settings },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resendingMail, setResendingMail] = useState(false);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    college: '', branch: 'CSE', graduationYear: 2026,
    targetPackage: 10, placementDate: '',
    targetCompanies: [], dailyGoal: 3, emailReminders: true
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleCompany = (c) => set('targetCompanies',
    form.targetCompanies.includes(c) ? form.targetCompanies.filter(x => x !== c) : [...form.targetCompanies, c]);

  const handleSubmit = async () => {
    if (!form.college.trim()) { toast.error('Please enter your college name'); return; }
    if (form.targetCompanies.length === 0) { toast.error('Select at least one target company'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/onboard', form);
      updateUser(data.user);
      toast.success('Welcome to PlacePrep!');
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const canNext = () => {
    if (step === 0) return form.college.trim().length > 0;
    if (step === 1) return form.targetPackage > 0;
    if (step === 2) return form.targetCompanies.length > 0;
    return true;
  };

  const handleResendWelcomeEmail = async () => {
    if (resendingMail) return;
    setResendingMail(true);
    try {
      const { data } = await api.post('/auth/resend-welcome');
      toast.success(data?.message || 'Welcome email sent successfully');
    } catch (e) {
      const msg = e?.response?.data?.message || 'Could not resend welcome email';
      toast.error(msg);
    } finally {
      setResendingMail(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🎯</div>
          <h1 className="text-2xl font-bold gradient-text">Welcome, {user?.name?.split(' ')[0]}!</h1>
          <p style={{ color: 'var(--text-secondary)' }} className="mt-1">Set up your placement journey in 4 quick steps</p>
          <button
            onClick={handleResendWelcomeEmail}
            disabled={resendingMail}
            className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border disabled:opacity-60"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            <Mail size={13} />
            {resendingMail ? 'Sending mail...' : 'Resend welcome email'}
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all`}
                style={i === step
                  ? { background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: 'white' }
                  : i < step
                  ? { background: 'rgba(21,128,61,0.15)', color: '#16a34a' }
                  : { color: 'var(--text-secondary)' }}>
                {i < step ? <Check size={14} /> : <s.icon size={14} />}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-8 h-0.5 mx-1 rounded" style={{ background: i < step ? '#7c3aed' : 'var(--border)' }} />
              )}
            </div>
          ))}
        </div>

        <div className="card">
          <AnimatePresence mode="wait">
            <motion.div key={step}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}>

              {step === 0 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Tell us about yourself</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>College Name *</label>
                    <input value={form.college} onChange={e => set('college', e.target.value)}
                      placeholder="e.g. VIT University, NIT Trichy..."
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-purple-500 transition-colors"
                      style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Branch</label>
                      <select value={form.branch} onChange={e => set('branch', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-purple-500"
                        style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                        {BRANCHES.map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Graduation Year</label>
                      <select value={form.graduationYear} onChange={e => set('graduationYear', Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-purple-500"
                        style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                        {YEARS.map(y => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Set your targets</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      Target Package: <span className="font-bold" style={{ color: '#7c3aed' }}>{form.targetPackage} LPA</span>
                    </label>
                    <input type="range" min={3} max={50} value={form.targetPackage}
                      onChange={e => set('targetPackage', Number(e.target.value))}
                      className="w-full accent-purple-600" />
                    <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      <span>3 LPA</span><span>25 LPA</span><span>50 LPA</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Expected Placement Date</label>
                    <input type="date" value={form.placementDate} onChange={e => set('placementDate', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-purple-500"
                      style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Target Companies</h2>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      Select companies you want to prepare for ({form.targetCompanies.length} selected)
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto py-1">
                    {COMPANIES.map(c => (
                      <button key={c} onClick={() => toggleCompany(c)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all`}
                        style={form.targetCompanies.includes(c)
                          ? { background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: 'white', borderColor: 'transparent' }
                          : { borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-primary)' }}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Customize your experience</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      Daily DSA Goal: <span className="font-bold" style={{ color: '#7c3aed' }}>{form.dailyGoal} problems/day</span>
                    </label>
                    <input type="range" min={1} max={10} value={form.dailyGoal}
                      onChange={e => set('dailyGoal', Number(e.target.value))}
                      className="w-full accent-purple-600" />
                    <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      <span>1/day</span><span>5/day</span><span>10/day</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}>
                    <div>
                      <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Email Reminders</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Daily DSA alerts & weekly progress reports</div>
                    </div>
                    <button onClick={() => set('emailReminders', !form.emailReminders)}
                      className={`w-12 h-6 rounded-full transition-all relative ${form.emailReminders ? 'bg-purple-600' : 'bg-gray-400'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${form.emailReminders ? 'right-0.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                  <div className="p-4 rounded-xl border" style={{ borderColor: '#7c3aed', background: 'rgba(124,58,237,0.05)' }}>
                    <div className="text-sm font-semibold mb-2" style={{ color: '#7c3aed' }}>Your Setup Summary</div>
                    <div className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div>🎓 {form.college} · {form.branch} · {form.graduationYear}</div>
                      <div>💰 Target: {form.targetPackage} LPA</div>
                      <div>🏢 {form.targetCompanies.length} companies: {form.targetCompanies.slice(0,5).join(', ')}{form.targetCompanies.length > 5 ? '...' : ''}</div>
                      <div>📅 Daily goal: {form.dailyGoal} DSA problems/day</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <button onClick={() => setStep(p => p - 1)} disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <ChevronLeft size={16} /> Back
            </button>
            {step < 3 ? (
              <button onClick={() => setStep(p => p + 1)} disabled={!canNext()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn-primary disabled:opacity-70">
                {loading ? 'Setting up...' : "Let's Go! 🚀"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
