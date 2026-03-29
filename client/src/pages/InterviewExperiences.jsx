import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Heart, Eye, ChevronDown, ChevronUp, Trash2, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const COMPANIES = ['All', 'TCS', 'Infosys', 'Wipro', 'Amazon', 'Google', 'Microsoft', 'Accenture', 'Capgemini', 'Cognizant', 'HCL', 'Deloitte', 'IBM', 'Oracle', 'Flipkart', 'Paytm', 'Zomato', 'Other'];
const YEARS = ['All', 2026, 2025, 2024, 2023, 2022];
const VERDICTS = ['All', 'Selected', 'Rejected', 'Pending'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const ROUNDS_PRESET = ['Online Assessment', 'Technical Round 1', 'Technical Round 2', 'HR Round', 'Group Discussion', 'Coding Round', 'System Design'];

const COMPANY_COLORS = {
  Amazon: '#ff9900', Google: '#4285f4', Microsoft: '#00a4ef', TCS: '#1976d2',
  Infosys: '#007cc2', Wipro: '#7c3aed', Accenture: '#a100ff', Capgemini: '#0070ad',
  Cognizant: '#1a9ed5', HCL: '#005f9e', Deloitte: '#86bc25', IBM: '#1f70c1',
  Oracle: '#f80000', Flipkart: '#2874f0', Paytm: '#00b9f5', Zomato: '#e23744',
};

function VerdictBadge({ verdict }) {
  const styles = {
    Selected: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' },
    Rejected: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
    Pending: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' },
  };
  const s = styles[verdict] || styles.Pending;
  return <span style={{ ...s, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{verdict}</span>;
}

function DifficultyStars({ difficulty }) {
  const count = { Easy: 1, Medium: 2, Hard: 3 }[difficulty] || 2;
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3].map(i => (
        <Star key={i} size={13} color={i <= count ? '#f59e0b' : 'var(--border)'} fill={i <= count ? '#f59e0b' : 'none'} />
      ))}
    </div>
  );
}

function ExperienceCard({ exp, onLike, onDelete, currentUserId }) {
  const [expanded, setExpanded] = useState(false);
  const companyColor = COMPANY_COLORS[exp.company] || '#7c3aed';
  const isOwn = exp.userId?.toString() === currentUserId?.toString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="card"
      style={{ overflow: 'hidden' }}
    >
      {/* Card Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: `${companyColor}22`,
            border: `1px solid ${companyColor}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 14,
            color: companyColor,
            flexShrink: 0
          }}>
            {exp.company.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 700, color: companyColor, fontSize: 16 }}>{exp.company}</span>
              <VerdictBadge verdict={exp.verdict} />
            </div>
            <p style={{ margin: '2px 0 0', color: 'var(--text-secondary)', fontSize: 13 }}>
              {exp.role} {exp.package && <span style={{ color: '#10b981' }}>· {exp.package}</span>}
            </p>
          </div>
        </div>
        {isOwn && (
          <button
            onClick={() => onDelete(exp._id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4, borderRadius: 6 }}
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>📅 {exp.year}</span>
        {exp.userCollege && <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>🎓 {exp.userCollege}</span>}
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>👤 {exp.userName}</span>
        <DifficultyStars difficulty={exp.difficulty} />
      </div>

      {/* Rounds mini-pills */}
      {exp.rounds?.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {exp.rounds.map((r, i) => (
            <span key={i} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 20, padding: '2px 10px', fontSize: 11, color: 'var(--text-secondary)' }}>
              {i + 1}. {r.name}
            </span>
          ))}
        </div>
      )}

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            {exp.rounds?.map((round, idx) => (
              <div key={idx} style={{ background: 'var(--bg-primary)', borderRadius: 10, padding: 14, marginBottom: 10, border: '1px solid var(--border)' }}>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px', fontSize: 14 }}>
                  Round {idx + 1}: {round.name}
                </p>
                {round.description && <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: '0 0 8px', lineHeight: 1.6 }}>{round.description}</p>}
                {round.questions?.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {round.questions.map((q, qi) => (
                      <li key={qi} style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 4 }}>{q}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {exp.tips && (
              <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, padding: 12, marginBottom: 10 }}>
                <p style={{ fontWeight: 600, color: '#7c3aed', margin: '0 0 4px', fontSize: 13 }}>💡 Tips</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{exp.tips}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <button
            onClick={() => onLike(exp._id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, color: exp.likedByMe ? '#ef4444' : 'var(--text-secondary)', fontSize: 13, padding: 0 }}
          >
            <Heart size={15} fill={exp.likedByMe ? '#ef4444' : 'none'} />
            {exp.likeCount}
          </button>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)', fontSize: 13 }}>
            <Eye size={15} /> {exp.views || 0}
          </span>
        </div>
        <button
          onClick={() => setExpanded(p => !p)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
        >
          {expanded ? <><ChevronUp size={15} /> Show Less</> : <><ChevronDown size={15} /> Read More</>}
        </button>
      </div>
    </motion.div>
  );
}

function ShareModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    company: '', role: '', package: '', year: new Date().getFullYear(),
    verdict: 'Pending', difficulty: 'Medium', tips: '', isAnonymous: false,
    rounds: [{ name: '', description: '', questions: [''] }]
  });
  const [submitting, setSubmitting] = useState(false);

  function updateField(k, v) { setForm(p => ({ ...p, [k]: v })); }

  function addRound() {
    setForm(p => ({ ...p, rounds: [...p.rounds, { name: '', description: '', questions: [''] }] }));
  }
  function removeRound(i) {
    setForm(p => ({ ...p, rounds: p.rounds.filter((_, idx) => idx !== i) }));
  }
  function updateRound(i, field, val) {
    setForm(p => {
      const rounds = [...p.rounds];
      rounds[i] = { ...rounds[i], [field]: val };
      return { ...p, rounds };
    });
  }
  function addQuestion(ri) {
    setForm(p => {
      const rounds = [...p.rounds];
      rounds[ri] = { ...rounds[ri], questions: [...rounds[ri].questions, ''] };
      return { ...p, rounds };
    });
  }
  function updateQuestion(ri, qi, val) {
    setForm(p => {
      const rounds = [...p.rounds];
      const questions = [...rounds[ri].questions];
      questions[qi] = val;
      rounds[ri] = { ...rounds[ri], questions };
      return { ...p, rounds };
    });
  }
  function removeQuestion(ri, qi) {
    setForm(p => {
      const rounds = [...p.rounds];
      rounds[ri] = { ...rounds[ri], questions: rounds[ri].questions.filter((_, i) => i !== qi) };
      return { ...p, rounds };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.company || !form.role || !form.year) { toast.error('Company, Role and Year are required'); return; }
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle = { width: '100%', padding: '10px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: 6, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, width: '100%', maxWidth: 620, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Share Your Experience</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Company *</label>
              <select value={form.company} onChange={e => updateField('company', e.target.value)} style={inputStyle}>
                <option value="">Select Company</option>
                {COMPANIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Role *</label>
              <input value={form.role} onChange={e => updateField('role', e.target.value)} placeholder="e.g. SDE-1, Analyst" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Package</label>
              <input value={form.package} onChange={e => updateField('package', e.target.value)} placeholder="e.g. 12 LPA" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Year *</label>
              <select value={form.year} onChange={e => updateField('year', parseInt(e.target.value))} style={inputStyle}>
                {YEARS.filter(y => y !== 'All').map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Verdict</label>
              <select value={form.verdict} onChange={e => updateField('verdict', e.target.value)} style={inputStyle}>
                {VERDICTS.filter(v => v !== 'All').map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Difficulty</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {DIFFICULTIES.map(d => (
                <button key={d} type="button" onClick={() => updateField('difficulty', d)}
                  style={{ flex: 1, padding: '8px 0', borderRadius: 10, border: form.difficulty === d ? '1px solid #7c3aed' : '1px solid var(--border)', background: form.difficulty === d ? 'rgba(124,58,237,0.15)' : 'var(--bg-primary)', color: form.difficulty === d ? '#7c3aed' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Rounds */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Interview Rounds</label>
              <button type="button" onClick={addRound}
                style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, padding: '4px 12px', color: '#7c3aed', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                + Add Round
              </button>
            </div>
            {form.rounds.map((round, ri) => (
              <div key={ri} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <select value={round.name} onChange={e => updateRound(ri, 'name', e.target.value)} style={{ ...inputStyle, flex: 1 }}>
                    <option value="">Select Round Type</option>
                    {ROUNDS_PRESET.map(r => <option key={r} value={r}>{r}</option>)}
                    <option value="Other">Other</option>
                  </select>
                  {form.rounds.length > 1 && (
                    <button type="button" onClick={() => removeRound(ri)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '0 10px', color: '#ef4444', cursor: 'pointer' }}><X size={14} /></button>
                  )}
                </div>
                <textarea value={round.description} onChange={e => updateRound(ri, 'description', e.target.value)}
                  placeholder="Describe this round..." rows={2}
                  style={{ ...inputStyle, resize: 'vertical', marginBottom: 8, fontFamily: 'inherit' }} />
                <div>
                  <p style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Questions asked:</p>
                  {round.questions.map((q, qi) => (
                    <div key={qi} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                      <input value={q} onChange={e => updateQuestion(ri, qi, e.target.value)}
                        placeholder={`Question ${qi + 1}`} style={{ ...inputStyle, flex: 1 }} />
                      {round.questions.length > 1 && (
                        <button type="button" onClick={() => removeQuestion(ri, qi)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '0 8px', color: '#ef4444', cursor: 'pointer' }}><X size={12} /></button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addQuestion(ri)} style={{ background: 'none', border: 'none', color: '#7c3aed', cursor: 'pointer', fontSize: 12, fontWeight: 600, padding: 0 }}>+ Add Question</button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label style={labelStyle}>Tips for Future Candidates</label>
            <textarea value={form.tips} onChange={e => updateField('tips', e.target.value)}
              placeholder="Share your preparation tips, what worked, what didn't..." rows={3}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 14 }}>
            <input type="checkbox" checked={form.isAnonymous} onChange={e => updateField('isAnonymous', e.target.checked)} style={{ width: 16, height: 16 }} />
            Post anonymously (your name/college won't be shown)
          </label>

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: '12px 0', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              style={{ flex: 2, padding: '12px 0', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', border: 'none', borderRadius: 10, color: 'white', cursor: submitting ? 'wait' : 'pointer', fontWeight: 600 }}>
              {submitting ? 'Sharing...' : 'Share Experience'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function InterviewExperiences() {
  const { user: currentUser } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ company: 'All', year: 'All', verdict: 'All' });
  const [showModal, setShowModal] = useState(false);

  const fetchExperiences = useCallback(async (pg = 1, overrideFilters = null) => {
    setLoading(true);
    try {
      const f = overrideFilters || filters;
      const params = new URLSearchParams({ page: pg, limit: 10 });
      if (f.company !== 'All') params.append('company', f.company);
      if (f.year !== 'All') params.append('year', f.year);
      if (f.verdict !== 'All') params.append('verdict', f.verdict);
      const { data } = await api.get(`/experiences?${params}`);
      setExperiences(data.experiences || []);
      setTotalPages(data.totalPages || 1);
      setPage(pg);
    } catch {
      toast.error('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchExperiences(1); }, []);

  function applyFilter(key, val) {
    const newFilters = { ...filters, [key]: val };
    setFilters(newFilters);
    fetchExperiences(1, newFilters);
  }

  async function handleLike(id) {
    try {
      const { data } = await api.put(`/experiences/${id}/like`);
      setExperiences(prev => prev.map(e =>
        e._id === id ? { ...e, likedByMe: data.liked, likeCount: data.likeCount } : e
      ));
    } catch {
      toast.error('Could not update like');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this experience?')) return;
    try {
      await api.delete(`/experiences/${id}`);
      toast.success('Experience deleted');
      fetchExperiences(page);
    } catch {
      toast.error('Could not delete experience');
    }
  }

  async function handleSubmit(form) {
    const { data } = await api.post('/experiences', form);
    toast.success('Experience shared!');
    fetchExperiences(1);
    return data;
  }

  return (
    <div style={{ padding: '24px', maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', borderRadius: 12, padding: 10 }}>
            <Users size={24} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Interview Experiences</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 14 }}>Real stories from real interviews</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', border: 'none', borderRadius: 10, padding: '10px 20px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}
        >
          <Plus size={16} /> Share Your Experience
        </button>
      </motion.div>

      {/* Company Chips */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {COMPANIES.map(c => (
          <button
            key={c}
            onClick={() => applyFilter('company', c)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: filters.company === c ? '1px solid #7c3aed' : '1px solid var(--border)',
              background: filters.company === c ? 'rgba(124,58,237,0.15)' : 'var(--bg-card)',
              color: filters.company === c ? '#7c3aed' : 'var(--text-secondary)',
              fontWeight: filters.company === c ? 700 : 400,
              cursor: 'pointer',
              fontSize: 13,
              whiteSpace: 'nowrap'
            }}
          >
            {c}
          </button>
        ))}
      </motion.div>

      {/* Year + Verdict Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Year:</span>
          {YEARS.map(y => (
            <button key={y} onClick={() => applyFilter('year', y)}
              style={{ padding: '5px 12px', borderRadius: 8, border: filters.year === y ? '1px solid #7c3aed' : '1px solid var(--border)', background: filters.year === y ? 'rgba(124,58,237,0.12)' : 'var(--bg-card)', color: filters.year === y ? '#7c3aed' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontWeight: filters.year === y ? 700 : 400 }}>
              {y}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Verdict:</span>
          {VERDICTS.map(v => (
            <button key={v} onClick={() => applyFilter('verdict', v)}
              style={{ padding: '5px 12px', borderRadius: 8, border: filters.verdict === v ? '1px solid #7c3aed' : '1px solid var(--border)', background: filters.verdict === v ? 'rgba(124,58,237,0.12)' : 'var(--bg-card)', color: filters.verdict === v ? '#7c3aed' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontWeight: filters.verdict === v ? 700 : 400 }}>
              {v}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Experiences List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : experiences.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}
        >
          <Users size={52} style={{ opacity: 0.2, marginBottom: 16 }} />
          <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>No experiences yet</p>
          <p style={{ marginBottom: 20 }}>Be the first to share from {filters.company !== 'All' ? filters.company : 'your company'}!</p>
          <button
            onClick={() => setShowModal(true)}
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', border: 'none', borderRadius: 10, padding: '12px 28px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
            Share Experience
          </button>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AnimatePresence>
            {experiences.map(exp => (
              <ExperienceCard
                key={exp._id}
                exp={exp}
                onLike={handleLike}
                onDelete={handleDelete}
                currentUserId={currentUser?._id}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button disabled={page === 1} onClick={() => fetchExperiences(page - 1)}
            style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>
            Prev
          </button>
          <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', fontSize: 14, padding: '0 8px' }}>
            Page {page} of {totalPages}
          </span>
          <button disabled={page === totalPages} onClick={() => fetchExperiences(page + 1)}
            style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>
            Next
          </button>
        </div>
      )}

      {/* Share Modal */}
      <AnimatePresence>
        {showModal && <ShareModal onClose={() => setShowModal(false)} onSubmit={handleSubmit} />}
      </AnimatePresence>
    </div>
  );
}
