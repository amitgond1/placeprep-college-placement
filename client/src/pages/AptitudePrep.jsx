import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Clock, Play, BarChart2, BookOpen, ChevronDown, ChevronRight, Trophy } from 'lucide-react';
import api from '../services/api';

const COMPANY_PATTERNS = [
  { name: 'TCS NQT', color: '#3b82f6', sections: [
    { name: 'Numerical Ability', qs: 26, time: '40 min' },
    { name: 'Verbal Ability', qs: 24, time: '30 min' },
    { name: 'Reasoning Ability', qs: 30, time: '50 min' },
    { name: 'Programming Logic', qs: 10, time: '15 min' },
    { name: 'Coding (Advanced)', qs: 2, time: '45 min' },
  ], cutoff: '55–65% sectional + overall', negativeMarking: 'No', calculator: 'Not allowed' },
  { name: 'Wipro NLTH', color: '#8b5cf6', sections: [
    { name: 'Aptitude', qs: 18, time: '' },
    { name: 'Verbal', qs: 22, time: '' },
    { name: 'Logical', qs: 20, time: '' },
    { name: 'Essay Writing', qs: 1, time: '20 min' },
  ], cutoff: 'Sectional cutoffs apply', negativeMarking: 'No', calculator: 'Not allowed' },
  { name: 'Infosys (InfyTQ)', color: '#06b6d4', sections: [
    { name: 'Aptitude + Puzzles', qs: 10, time: '25 min' },
    { name: 'Verbal', qs: 15, time: '25 min' },
    { name: 'Reasoning', qs: 15, time: '25 min' },
    { name: 'Pseudo Code', qs: 5, time: '' },
  ], cutoff: '65%+ recommended', negativeMarking: 'No', calculator: 'Not allowed' },
  { name: 'Cognizant GenC', color: '#10b981', sections: [
    { name: 'GenC: Basic Aptitude + English + Automata Fix', qs: 0, time: '' },
    { name: 'GenC Pro: Moderate aptitude + coding', qs: 0, time: '' },
    { name: 'GenC Elevate: Hard DSA + Aptitude + System Design', qs: 0, time: '' },
  ], cutoff: 'Role-dependent', negativeMarking: 'No', calculator: 'Basic allowed' },
  { name: 'Capgemini', color: '#f59e0b', sections: [
    { name: 'Aptitude', qs: 16, time: '' },
    { name: 'Behavioral (Game-based)', qs: 18, time: '' },
    { name: 'Essay Writing', qs: 1, time: '20 min' },
  ], cutoff: '60%+ overall', negativeMarking: 'No', calculator: 'Not allowed' },
  { name: 'Accenture', color: '#a855f7', sections: [
    { name: 'Abstract Reasoning', qs: 20, time: '20 min' },
    { name: 'Common Sense', qs: 14, time: '' },
    { name: 'Attention to Detail', qs: 12, time: '' },
    { name: 'Written Communication (Essay)', qs: 1, time: '250 words' },
  ], cutoff: '70%+ recommended', negativeMarking: 'No', calculator: 'Not allowed' },
  { name: 'HCL', color: '#ef4444', sections: [
    { name: 'Aptitude', qs: 25, time: '' },
    { name: 'Technical MCQ', qs: 0, time: '' },
    { name: 'Coding', qs: 2, time: '' },
  ], cutoff: '60%+ overall', negativeMarking: 'Varies', calculator: 'Not allowed' },
  { name: 'Tech Mahindra', color: '#ec4899', sections: [
    { name: 'Aptitude', qs: 25, time: '' },
    { name: 'Psychometric Assessment', qs: 0, time: '' },
    { name: 'Technical MCQ', qs: 0, time: '' },
  ], cutoff: 'Aptitude 60%+', negativeMarking: 'No', calculator: 'Not allowed' },
  { name: 'Zoho', color: '#14b8a6', sections: [
    { name: 'Very Hard Aptitude', qs: 0, time: '' },
    { name: 'Custom Coding Platform', qs: 5, time: '' },
  ], cutoff: 'Very competitive — 80%+ needed', negativeMarking: 'Yes (-1)', calculator: 'Not allowed' },
];

const TOPICS = ['Quantitative Aptitude','Logical Reasoning','Verbal Ability','Data Interpretation','Number System','Percentages','Time & Work','Time Speed Distance','Profit & Loss','Probability','Series','Syllogisms','Blood Relations','Direction Sense','Coding-Decoding','Averages','Ages','Ratio & Proportion','LCM/HCF','Geometry'];

const MOCK_TYPE_LABELS = {
  mock_tcs_1: { label: 'TCS NQT Mock 1', company: 'TCS', duration: 40, color: '#3b82f6' },
  mock_tcs_2: { label: 'TCS NQT Mock 2', company: 'TCS', duration: 40, color: '#3b82f6' },
  mock_tcs_3: { label: 'TCS NQT Mock 3', company: 'TCS', duration: 40, color: '#3b82f6' },
  mock_tcs_4: { label: 'TCS NQT Mock 4', company: 'TCS', duration: 40, color: '#3b82f6' },
  mock_tcs_5: { label: 'TCS NQT Mock 5', company: 'TCS', duration: 40, color: '#3b82f6' },
  mock_wipro_1: { label: 'Wipro NLTH Mock 1', company: 'Wipro', duration: 35, color: '#8b5cf6' },
  mock_wipro_2: { label: 'Wipro NLTH Mock 2', company: 'Wipro', duration: 35, color: '#8b5cf6' },
  mock_infosys_1: { label: 'Infosys InfyTQ Mock 1', company: 'Infosys', duration: 35, color: '#06b6d4' },
  mock_infosys_2: { label: 'Infosys InfyTQ Mock 2', company: 'Infosys', duration: 35, color: '#06b6d4' },
  mock_cognizant_1: { label: 'Cognizant GenC Mock 1', company: 'Cognizant', duration: 30, color: '#10b981' },
  mock_cognizant_2: { label: 'Cognizant GenC Mock 2', company: 'Cognizant', duration: 30, color: '#10b981' },
  mock_cognizant_3: { label: 'Cognizant GenC Mock 3', company: 'Cognizant', duration: 30, color: '#10b981' },
  mock_accenture_1: { label: 'Accenture Cognitive Mock 1', company: 'Accenture', duration: 30, color: '#a855f7' },
  mock_accenture_2: { label: 'Accenture Cognitive Mock 2', company: 'Accenture', duration: 30, color: '#a855f7' },
  mock_accenture_3: { label: 'Accenture Cognitive Mock 3', company: 'Accenture', duration: 30, color: '#a855f7' },
  mock_capgemini_1: { label: 'Capgemini Mock 1', company: 'Capgemini', duration: 30, color: '#f59e0b' },
  mock_capgemini_2: { label: 'Capgemini Mock 2', company: 'Capgemini', duration: 30, color: '#f59e0b' },
  mock_general_1: { label: 'General Aptitude Mock 1', company: 'General', duration: 30, color: '#64748b' },
  mock_general_2: { label: 'General Aptitude Mock 2', company: 'General', duration: 30, color: '#64748b' },
  mock_general_3: { label: 'General Aptitude Mock 3', company: 'General', duration: 30, color: '#64748b' },
};

const TABS = ['Mock Tests', 'Topic Drill', 'Company Patterns', 'My Results'];
const TAB_QUERY_KEYS = ['mocks', 'drill', 'patterns', 'results'];

const getTabIndexFromQuery = (searchParams) => {
  const key = searchParams.get('tab');
  const idx = TAB_QUERY_KEYS.indexOf(key);
  return idx >= 0 ? idx : 0;
};

export default function AptitudePrep() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(() => getTabIndexFromQuery(searchParams));
  const [mocks, setMocks] = useState([]);
  const [results, setResults] = useState([]);
  const [loadingMocks, setLoadingMocks] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [drill, setDrill] = useState({ topic: '', difficulty: '', count: 10 });
  const [drillQs, setDrillQs] = useState([]);
  const [drillIdx, setDrillIdx] = useState(0);
  const [drillAns, setDrillAns] = useState(null);
  const [drillScore, setDrillScore] = useState(0);
  const [drillActive, setDrillActive] = useState(false);
  const [drillLoading, setDrillLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTab(getTabIndexFromQuery(searchParams));
  }, [searchParams]);

  const onTabChange = (index) => {
    setTab(index);
    const next = new URLSearchParams(searchParams);
    next.set('tab', TAB_QUERY_KEYS[index]);
    setSearchParams(next);
  };

  const fetchData = async () => {
    try {
      const [mocksRes, resultsRes] = await Promise.all([
        api.get('/aptitude/mocks'),
        api.get('/aptitude/results')
      ]);
      setMocks(mocksRes.data.mocks || []);
      setResults(resultsRes.data.results || []);
    } catch { /* ignore */ }
    finally { setLoadingMocks(false); }
  };

  const startDrill = async () => {
    if (!drill.topic) { toast.error('Select a topic'); return; }
    setDrillLoading(true);
    try {
      const { data } = await api.get('/aptitude/drill', { params: drill });
      setDrillQs(data.questions);
      setDrillIdx(0); setDrillAns(null); setDrillScore(0); setDrillActive(true);
    } catch { toast.error('Failed to load questions'); }
    finally { setDrillLoading(false); }
  };

  const checkDrillAnswer = async (qId, ans) => {
    setDrillAns(ans);
    try {
      const { data } = await api.post('/aptitude/drill/check', { questionId: qId, userAnswer: ans });
      if (data.isCorrect) setDrillScore(s => s + 1);
      setDrillQs(prev => prev.map((q, i) =>
        i === drillIdx ? { ...q, correctAnswer: data.correctAnswer, explanation: data.explanation } : q
      ));
    } catch {}
  };

  const prevResultScore = (mockId) => {
    const r = results.find(r => r.mockId === mockId);
    return r ? r.score : null;
  };

  const getMockMeta = (mockId) => {
    const preset = MOCK_TYPE_LABELS[mockId] || {};
    const live = mocks.find(m => m.mockId === mockId) || {};
    return {
      label: preset.label || live.title || mockId.replace(/_/g, ' ').toUpperCase(),
      company: preset.company || live.company || 'General',
      duration: preset.duration || live.duration || 30,
      color: preset.color || '#64748b'
    };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>📐 Aptitude Prep</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Master quantitative, logical, and verbal aptitude for campus placements</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => onTabChange(i)}
            className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
            style={tab === i
              ? { background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: 'white' }
              : { color: 'var(--text-secondary)' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Mock Tests Tab */}
      {tab === 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loadingMocks
            ? Array(9).fill(0).map((_, i) => <div key={i} className="skeleton h-36 rounded-xl" />)
            : mocks.length === 0 ? (
              <div className="card text-center py-10 col-span-full">
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No aptitude mocks found</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Seed aptitude data and refresh this page.</p>
              </div>
            ) : mocks.map(({ mockId }) => {
                const meta = getMockMeta(mockId);
                const prev = prevResultScore(mockId);
                return (
                  <motion.div key={mockId} whileHover={{ y: -2 }}
                    className="card cursor-pointer" onClick={() => navigate(`/aptitude/mock/${mockId}`)}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: meta.color }}>{meta.company}</span>
                      {prev !== null && (
                        <span className="text-xs font-semibold" style={{ color: prev >= 16 ? '#22c55e' : '#f59e0b' }}>
                          {prev}/25
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{meta.label}</h3>
                    <div className="flex items-center gap-3 text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                      <span className="flex items-center gap-1"><BookOpen size={12} /> 25 Qs</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {meta.duration} min</span>
                    </div>
                    <button className="w-full py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
                      {prev !== null ? 'Retake Test' : 'Start Test'} →
                    </button>
                  </motion.div>
                );
              })
          }
        </div>
      )}

      {/* Topic Drill Tab */}
      {tab === 1 && (
        <div className="space-y-4">
          {!drillActive ? (
            <div className="card space-y-5">
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Configure Topic Drill</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Topic *</label>
                  <select value={drill.topic} onChange={e => setDrill(p => ({ ...p, topic: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <option value="">Select topic...</option>
                    {TOPICS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Difficulty</label>
                  <select value={drill.difficulty} onChange={e => setDrill(p => ({ ...p, difficulty: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <option value="">Any</option>
                    <option>Easy</option><option>Medium</option><option>Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Questions</label>
                  <select value={drill.count} onChange={e => setDrill(p => ({ ...p, count: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <option value={10}>10 Questions</option>
                    <option value={20}>20 Questions</option>
                    <option value={30}>30 Questions</option>
                  </select>
                </div>
              </div>
              <button onClick={startDrill} disabled={drillLoading} className="btn-primary">
                {drillLoading ? 'Loading...' : <><Play size={15} /> Start Drill</>}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Q{drillIdx + 1}/{drillQs.length} · Score: {drillScore}/{drillIdx + (drillAns ? 1 : 0)}
                </div>
                <button onClick={() => setDrillActive(false)} className="text-xs px-3 py-1.5 rounded-lg border"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>End Drill</button>
              </div>
              {drillIdx < drillQs.length && (
                <div className="card space-y-4">
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{drillQs[drillIdx].questionText}</p>
                  <div className="space-y-2">
                    {['A','B','C','D'].map((opt, i) => {
                      const isSelected = drillAns === opt;
                      const isCorrect = drillQs[drillIdx].correctAnswer === opt;
                      const bg = !drillAns ? 'var(--bg-primary)'
                        : isCorrect ? 'rgba(34,197,94,0.15)'
                        : isSelected ? 'rgba(239,68,68,0.15)'
                        : 'var(--bg-primary)';
                      const border = !drillAns ? 'var(--border)'
                        : isCorrect ? '#22c55e'
                        : isSelected ? '#ef4444'
                        : 'var(--border)';
                      return (
                        <button key={opt} disabled={!!drillAns}
                          onClick={() => checkDrillAnswer(drillQs[drillIdx]._id, opt)}
                          className="w-full flex items-start gap-3 p-3 rounded-xl border text-left text-sm transition-all"
                          style={{ background: bg, borderColor: border, color: 'var(--text-primary)' }}>
                          <span className="font-bold shrink-0 w-5">{opt}.</span>
                          {drillQs[drillIdx].options?.[i]}
                        </button>
                      );
                    })}
                  </div>
                  {drillAns && drillQs[drillIdx].explanation && (
                    <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: 'var(--text-secondary)' }}>
                      <span className="font-semibold" style={{ color: '#06b6d4' }}>Explanation: </span>
                      {drillQs[drillIdx].explanation}
                    </div>
                  )}
                  {drillAns && (
                    <button onClick={() => {
                      if (drillIdx + 1 >= drillQs.length) { setDrillActive(false); toast.success(`Drill complete! ${drillScore}/${drillQs.length}`); }
                      else { setDrillIdx(i => i + 1); setDrillAns(null); }
                    }} className="btn-primary">
                      {drillIdx + 1 >= drillQs.length ? 'Finish Drill' : 'Next Question'} <ChevronRight size={15} />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Company Patterns Tab */}
      {tab === 2 && (
        <div className="space-y-3">
          {COMPANY_PATTERNS.map((cp, i) => (
            <div key={i} className="card p-0 overflow-hidden">
              <button className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setExpanded(expanded === i ? null : i)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: cp.color }}>{cp.name.substring(0,2)}</div>
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{cp.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Cutoff: {cp.cutoff}</div>
                  </div>
                </div>
                <ChevronDown size={16} className={`transition-transform ${expanded === i ? 'rotate-180' : ''}`}
                  style={{ color: 'var(--text-secondary)' }} />
              </button>
              <AnimatePresence>
                {expanded === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="p-5 space-y-4">
                      <div className="grid sm:grid-cols-3 gap-3">
                        {cp.sections.map((s, j) => (
                          <div key={j} className="p-3 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.name}</div>
                            {s.qs > 0 && <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{s.qs} Questions {s.time && `· ${s.time}`}</div>}
                            {s.time && s.qs === 0 && <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{s.time}</div>}
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span style={{ color: 'var(--text-secondary)' }}>Negative Marking: <strong style={{ color: 'var(--text-primary)' }}>{cp.negativeMarking}</strong></span>
                        <span style={{ color: 'var(--text-secondary)' }}>Calculator: <strong style={{ color: 'var(--text-primary)' }}>{cp.calculator}</strong></span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* My Results Tab */}
      {tab === 3 && (
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="card text-center py-12">
              <Trophy size={40} className="mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
              <p style={{ color: 'var(--text-secondary)' }}>No mock tests attempted yet. Start a mock test to track your progress!</p>
              <button onClick={() => setTab(0)} className="btn-primary mt-4">Browse Mock Tests</button>
            </div>
          ) : (
            <div className="card p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Mock Test','Score','Accuracy','Percentile','Date','Action'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-medium" style={{ color: 'var(--text-secondary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => {
                    const meta = getMockMeta(r.mockId);
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                          {meta.label}
                        </td>
                        <td className="px-4 py-3 font-bold" style={{ color: r.score >= 16 ? '#22c55e' : r.score >= 12 ? '#f59e0b' : '#ef4444' }}>
                          {r.score}/{r.totalQuestions}
                        </td>
                        <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                          {Math.round((r.score / r.totalQuestions) * 100)}%
                        </td>
                        <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>~{r.percentile}%ile</td>
                        <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => navigate(`/aptitude/results/${r._id}`)}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                            style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
