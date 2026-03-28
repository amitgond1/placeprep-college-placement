import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Code2, Clock, Mic, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const COMPANY_PACKAGES = [
  { company: 'TCS', min: 3.5, max: 7, tier: 1 },
  { company: 'Wipro', min: 3.5, max: 6.5, tier: 1 },
  { company: 'Infosys', min: 3.6, max: 8, tier: 1 },
  { company: 'Cognizant', min: 4, max: 8, tier: 1 },
  { company: 'Accenture', min: 4.5, max: 9, tier: 1 },
  { company: 'HCL', min: 3.5, max: 6, tier: 1 },
  { company: 'Capgemini', min: 4, max: 7, tier: 1 },
  { company: 'Tech Mahindra', min: 3.8, max: 6.5, tier: 1 },
  { company: 'Zoho', min: 8, max: 15, tier: 2 },
  { company: 'Flipkart', min: 25, max: 50, tier: 3 },
  { company: 'Razorpay', min: 20, max: 35, tier: 3 },
  { company: 'Zepto', min: 18, max: 30, tier: 3 },
  { company: 'Microsoft', min: 30, max: 60, tier: 4 },
  { company: 'Amazon', min: 25, max: 50, tier: 4 },
  { company: 'Google', min: 40, max: 80, tier: 4 },
  { company: 'Meta', min: 40, max: 80, tier: 4 },
  { company: 'Apple', min: 35, max: 70, tier: 4 },
  { company: 'Netflix', min: 50, max: 100, tier: 4 },
];

function getInHand(lpa) {
  const monthly = (lpa * 100000) / 12;
  // Approximate take-home after taxes (India)
  let taxRate = lpa < 5 ? 0.05 : lpa < 10 ? 0.1 : lpa < 15 ? 0.15 : lpa < 25 ? 0.2 : 0.28;
  const pf = 1800; // PF deduction per month approx
  return Math.round(monthly * (1 - taxRate) - pf);
}

function getDSANeeded(lpa) {
  if (lpa < 5) return 100;
  if (lpa < 10) return 200;
  if (lpa < 20) return 300;
  if (lpa < 40) return 400;
  return 500;
}

function getMocksNeeded(lpa, currentScore) {
  const targetScore = lpa < 10 ? 60 : lpa < 25 ? 75 : 85;
  if (currentScore >= targetScore) return 0;
  return Math.ceil((targetScore - currentScore) / 5) * 3;
}

export default function PackageCalculator() {
  const { user } = useAuth();
  const [target, setTarget] = useState(user?.targetPackage || 15);
  const [monthsLeft, setMonthsLeft] = useState(6);

  useEffect(() => {
    if (user?.placementDate) {
      const diff = Math.max(1, Math.ceil((new Date(user.placementDate) - new Date()) / (1000 * 60 * 60 * 24 * 30)));
      setMonthsLeft(diff);
    }
  }, [user]);

  const inHand = getInHand(target);
  const dsaNeeded = getDSANeeded(target);
  const mocksNeeded = getMocksNeeded(target, 50); // assume baseline 50/100
  const hoursPerDay = Math.min(10, Math.ceil(dsaNeeded / (monthsLeft * 25)));

  const matchingCompanies = COMPANY_PACKAGES.filter(c => target >= c.min && target <= c.max + 5);
  const nearCompanies = COMPANY_PACKAGES.filter(c => target >= c.min * 0.8 && target <= c.max * 1.2 && !matchingCompanies.includes(c));

  const tierColors = { 1: '#64748b', 2: '#06b6d4', 3: '#f59e0b', 4: '#7c3aed' };
  const tierLabels = { 1: 'Mass Recruiter', 2: 'Mid Tier', 3: 'Product Company', 4: 'FAANG' };

  const stats = [
    { icon: DollarSign, label: 'Monthly In-Hand', value: `₹${(inHand / 1000).toFixed(1)}K`, sub: `≈ ₹${inHand.toLocaleString()}/month after tax`, color: '#22c55e' },
    { icon: Code2, label: 'DSA Problems Needed', value: dsaNeeded.toString(), sub: `${Math.max(0, dsaNeeded - (user?.dsaSolvedTotal || 0))} remaining`, color: '#7c3aed' },
    { icon: Clock, label: 'Study Hours/Day', value: `${hoursPerDay}h`, sub: `Over ${monthsLeft} months`, color: '#06b6d4' },
    { icon: Mic, label: 'Mock Interviews', value: `${mocksNeeded}+`, sub: 'To reach target readiness', color: '#f59e0b' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Package Calculator</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Understand what it takes to reach your target package</p>
      </div>

      {/* Target Input */}
      <div className="card space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Target Package: <span className="font-black text-2xl gradient-text">{target} LPA</span>
          </label>
          <input type="range" min={3} max={80} value={target} onChange={e => setTarget(Number(e.target.value))}
            className="w-full accent-purple-600" />
          <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            <span>3 LPA (TCS)</span><span>25 LPA (Zoho)</span><span>50+ LPA (FAANG)</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Months until Placement: <span className="font-bold" style={{ color: '#7c3aed' }}>{monthsLeft} months</span>
          </label>
          <input type="range" min={1} max={24} value={monthsLeft} onChange={e => setMonthsLeft(Number(e.target.value))}
            className="w-full accent-purple-600" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} className="card">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl" style={{ background: `${s.color}15` }}>
                <s.icon size={20} style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
                <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{s.sub}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Matching Companies */}
      <div className="card">
        <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Companies offering {target} LPA
        </h2>
        {matchingCompanies.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No exact matches. Try adjusting the target.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {matchingCompanies.map(c => (
              <div key={c.company} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border"
                style={{ borderColor: tierColors[c.tier], background: `${tierColors[c.tier]}10`, color: 'var(--text-primary)' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: tierColors[c.tier] }} />
                {c.company}
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{c.min}–{c.max} LPA</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          {Object.entries(tierColors).map(([tier, color]) => (
            <div key={tier} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              {tierLabels[tier]}
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="card">
        <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Your {monthsLeft}-Month Roadmap for {target} LPA
        </h2>
        <div className="space-y-3">
          {[
            { month: `Month 1–${Math.ceil(monthsLeft * 0.3)}`, task: 'Master DSA Basics: Arrays, Strings, Linked Lists, Trees', icon: '📚' },
            { month: `Month ${Math.ceil(monthsLeft * 0.3)}–${Math.ceil(monthsLeft * 0.6)}`, task: target > 20 ? 'Advanced DSA: Graphs, DP, Segment Trees + System Design basics' : 'Core DSA: Sorting, Searching, Hashing + 10+ Aptitude Mocks', icon: '⚡' },
            { month: `Month ${Math.ceil(monthsLeft * 0.6)}–${Math.ceil(monthsLeft * 0.8)}`, task: `Company-specific prep: Solve ${COMPANY_PACKAGES.filter(c => target >= c.min).slice(0, 3).map(c => c.company).join(', ')} tagged questions`, icon: '🎯' },
            { month: `Month ${Math.ceil(monthsLeft * 0.8)}–${monthsLeft}`, task: '10+ Mock Interviews + Resume ATS optimization + HR prep', icon: '🚀' },
          ].map((step, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <span className="text-xl shrink-0">{step.icon}</span>
              <div>
                <div className="text-xs font-bold mb-0.5" style={{ color: '#7c3aed' }}>{step.month}</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{step.task}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DSA progress */}
      {user?.dsaSolvedTotal > 0 && (
        <div className="card">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>DSA Progress Toward Target</span>
            <span className="text-sm font-bold" style={{ color: '#7c3aed' }}>{user.dsaSolvedTotal}/{dsaNeeded}</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (user.dsaSolvedTotal / dsaNeeded) * 100)}%`, background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }} />
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
            {user.dsaSolvedTotal >= dsaNeeded
              ? '✅ You have solved enough problems for your target!'
              : `${dsaNeeded - user.dsaSolvedTotal} more problems to go. Keep pushing! 💪`}
          </p>
        </div>
      )}
    </div>
  );
}
