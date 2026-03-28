import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Code2, Flame, Target, Calendar, TrendingUp, FileText,
  Mic, ChevronRight, Trophy, Star, Zap, BarChart2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

/* ─── Animation variants ─── */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } }
};

/* ─── Skeleton block ─── */
function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

/* ─── Stat Card ─── */
function StatCard({ icon: Icon, label, value, sub, color, loading }) {
  return (
    <motion.div variants={cardVariants} className="card flex flex-col gap-3">
      {loading ? (
        <>
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-4 w-24 mt-1" />
          <Skeleton className="h-8 w-16" />
        </>
      ) : (
        <>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${color}22` }}
          >
            <Icon size={20} style={{ color }} />
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</p>
          <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
          {sub && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
        </>
      )}
    </motion.div>
  );
}

/* ─── ATS Gauge Bar ─── */
function ATSBar({ company, score, date }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{company}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{date}</span>
          <span className="text-sm font-bold" style={{ color }}>{score}%</span>
        </div>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
        />
      </div>
    </div>
  );
}

/* ─── Company Readiness Bar ─── */
function CompanyBar({ company, score }) {
  const color = score >= 70 ? '#7c3aed' : score >= 40 ? '#06b6d4' : '#94a3b8';
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{company}</span>
        <span className="text-sm font-semibold" style={{ color }}>{score}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, #7c3aed, #06b6d4)` }}
        />
      </div>
    </div>
  );
}

/* ─── Custom Recharts Tooltip ─── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-xl text-sm shadow-lg"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)'
      }}
    >
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════
   DASHBOARD COMPONENT
════════════════════════════════════════════ */
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/user/profile').catch(() => ({ data: null })),
      api.get('/user/stats').catch(() => ({ data: null }))
    ]).then(([profileRes, statsRes]) => {
      setProfile(profileRes.data?.user || null);
      setStats(statsRes.data);
    }).finally(() => setLoading(false));
  }, []);

  /* ── derived display values ── */
  const name          = profile?.name     ?? user?.name       ?? 'Student';
  const dsaToday      = stats?.dsa?.today ?? 0;
  const dsaWeek       = stats?.dsa?.week  ?? 0;
  const dsaTotal      = stats?.dsa?.total ?? 0;
  const streak        = stats?.streak     ?? 0;
  const daysLeft      = stats?.daysUntilPlacement ?? '—';
  const targetPkgRaw  = profile?.targetPackage ?? stats?.targetPackage ?? user?.targetPackage;
  const hasTargetPkg  = targetPkgRaw !== null && targetPkgRaw !== undefined && targetPkgRaw !== '';
  const leetcodeCount = profile?.leetcodeSolved ?? stats?.leetcodeSolved ?? null;

  const scoreHistory = stats?.mockScoreHistory ?? [
    { date: 'Week 1', score: 54 },
    { date: 'Week 2', score: 61 },
    { date: 'Week 3', score: 58 },
    { date: 'Week 4', score: 70 },
    { date: 'Week 5', score: 74 },
    { date: 'Week 6', score: 82 },
  ];

  const atsScores = stats?.atsScores ?? [
    { company: 'Amazon Resume', score: 78, date: 'Mar 20' },
    { company: 'Google Resume', score: 91, date: 'Mar 22' },
    { company: 'TCS Resume',    score: 65, date: 'Mar 25' },
  ];

  const companyReadiness = profile?.targetCompanies?.map((c, i) => ({
    company: c,
    score: stats?.companyReadiness?.[c] ?? [45, 62, 55, 70, 80][i % 5]
  })) ?? [
    { company: 'Amazon',    score: 72 },
    { company: 'Google',    score: 55 },
    { company: 'Microsoft', score: 68 },
    { company: 'TCS',       score: 85 },
  ];

  const aptitudeStats = stats?.aptitude ?? {
    mocksAttempted: 4,
    bestScore: 22,
    average: 18.5
  };

  /* ─── Quick Actions ─── */
  const quickActions = [
    { label: 'Start Mock Interview', icon: Mic,    path: '/mock',      color: '#7c3aed' },
    { label: 'Practice DSA',         icon: Code2,  path: '/dsa',       color: '#06b6d4' },
    { label: 'Check Resume ATS',     icon: FileText,path: '/resume',   color: '#8b5cf6' },
    { label: 'Aptitude Prep',        icon: BarChart2,path: '/aptitude',color: '#0891b2' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* ── Welcome Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-extrabold gradient-text">
            Welcome back, {name}! 🚀
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>

        {leetcodeCount !== null && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border"
            style={{ borderColor: '#f59e0b', background: '#f59e0b11' }}
          >
            <Trophy size={16} style={{ color: '#f59e0b' }} />
            <span className="text-sm font-semibold" style={{ color: '#f59e0b' }}>
              LeetCode: {leetcodeCount} solved
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* ── Stats Grid ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          icon={Code2}
          label="DSA Solved (Today / Week / Total)"
          value={`${dsaToday} / ${dsaWeek} / ${dsaTotal}`}
          sub="Keep the momentum going!"
          color="#7c3aed"
          loading={loading}
        />
        <StatCard
          icon={Calendar}
          label="Days Until Placement"
          value={daysLeft}
          sub="Stay focused every day"
          color="#06b6d4"
          loading={loading}
        />
        <StatCard
          icon={Flame}
          label="Current Streak 🔥"
          value={`${streak} days`}
          sub={streak >= 7 ? 'Amazing consistency!' : 'Build your streak!'}
          color="#f97316"
          loading={loading}
        />
        <StatCard
          icon={Target}
          label="Target Package"
          value={hasTargetPkg ? `${targetPkgRaw} LPA` : '—'}
          sub="Set in your profile"
          color="#10b981"
          loading={loading}
        />
      </motion.div>

      {/* ── Row 2: Score History + ATS Scores ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Score History Chart */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="card lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              Mock Score History
            </h2>
            <TrendingUp size={18} style={{ color: '#7c3aed' }} />
          </div>

          {loading ? (
            <Skeleton className="h-52 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={scoreHistory} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Score"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={{ fill: '#7c3aed', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#06b6d4' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* ATS Scores */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="card"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              ATS Scores
            </h2>
            <FileText size={18} style={{ color: '#06b6d4' }} />
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : atsScores.length > 0 ? (
            atsScores.slice(-3).map((a, i) => (
              <ATSBar key={i} company={a.company} score={a.score} date={a.date} />
            ))
          ) : (
            <p className="text-sm text-center py-8" style={{ color: 'var(--text-secondary)' }}>
              No ATS scans yet.<br />Upload your resume to get started.
            </p>
          )}

          <button
            onClick={() => navigate('/resume')}
            className="w-full mt-2 text-sm font-semibold py-2 rounded-xl transition-all hover:opacity-80"
            style={{
              background: 'linear-gradient(135deg,#7c3aed22,#06b6d422)',
              color: '#7c3aed',
              border: '1px solid #7c3aed44'
            }}
          >
            Scan Resume →
          </button>
        </motion.div>
      </div>

      {/* ── Row 3: Company Readiness + Aptitude Stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Company Readiness */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="card lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              Company Readiness
            </h2>
            <Star size={18} style={{ color: '#f59e0b' }} />
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
          ) : companyReadiness.length > 0 ? (
            companyReadiness.map((c, i) => (
              <CompanyBar key={i} company={c.company} score={c.score} />
            ))
          ) : (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Add target companies in your profile to track readiness.
            </p>
          )}
        </motion.div>

        {/* Aptitude Quick Stats */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="card"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              Aptitude Stats
            </h2>
            <Zap size={18} style={{ color: '#f59e0b' }} />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { label: 'Mocks Attempted', value: aptitudeStats.mocksAttempted, icon: '📝', color: '#7c3aed' },
                { label: 'Best Score',       value: `${aptitudeStats.bestScore}/25`,  icon: '🏆', color: '#f59e0b' },
                { label: 'Average Score',    value: `${aptitudeStats.average}/25`,    icon: '📊', color: '#06b6d4' },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: 'var(--bg-primary)' }}
                >
                  <div className="flex items-center gap-2">
                    <span>{s.icon}</span>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                  </div>
                  <span className="font-bold text-base" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate('/aptitude')}
            className="btn-primary w-full mt-5 justify-center text-sm"
          >
            Practice Now <ChevronRight size={14} />
          </button>
        </motion.div>
      </div>

      {/* ── Quick Actions ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {quickActions.map((qa, i) => (
          <motion.button
            key={i}
            variants={cardVariants}
            onClick={() => navigate(qa.path)}
            whileHover={{ y: -4, boxShadow: `0 12px 30px ${qa.color}33` }}
            whileTap={{ scale: 0.97 }}
            className="card flex flex-col items-center gap-3 py-6 cursor-pointer border-transparent transition-all"
            style={{ borderColor: `${qa.color}33` }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: `${qa.color}22` }}
            >
              <qa.icon size={22} style={{ color: qa.color }} />
            </div>
            <span className="text-sm font-semibold text-center" style={{ color: 'var(--text-primary)' }}>
              {qa.label}
            </span>
          </motion.button>
        ))}
      </motion.div>

    </div>
  );
}
