import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Shuffle, Filter, CheckCircle2, Circle, RotateCcw } from 'lucide-react';
import api from '../services/api';

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
const STATUSES = ['All', 'Solved', 'Unsolved'];
const DEFAULT_COMPANIES = ['All', 'Amazon', 'Google', 'Microsoft', 'Meta', 'Flipkart', 'Zoho', 'TCS', 'Wipro', 'Infosys', 'Cognizant', 'Accenture'];
const DEFAULT_TOPICS = ['All', 'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Stack', 'Queue', 'Heap', 'Hash Set', 'Binary Search', 'Backtracking', 'Greedy', 'Math'];

const DIFF_COLORS = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };
const DIFF_BG = { Easy: '#22c55e15', Medium: '#f59e0b15', Hard: '#ef444415' };
const COMPANY_COLORS = {
  Amazon: '#FF9900', Google: '#4285F4', Microsoft: '#00A4EF', Meta: '#1877F2',
  Apple: '#888', Netflix: '#E50914', Flipkart: '#2874F0', Zoho: '#C8202D',
  TCS: '#003087', Wipro: '#341C5B', Infosys: '#007CC3', Cognizant: '#0033A0', Accenture: '#A100FF',
};
const COMPANY_ICONS = {
  Amazon: '🔴', Google: '🔵', Microsoft: '🟦', Meta: '🟣', Apple: '⚫',
  Netflix: '🔴', Flipkart: '🔷', Zoho: '🟥', TCS: '🔹', Wipro: '🟪',
  Infosys: '🔵', Cognizant: '🟦', Accenture: '🟣',
};

export default function DSATracker() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [companies, setCompanies] = useState(DEFAULT_COMPANIES);
  const [topics, setTopics] = useState(DEFAULT_TOPICS);
  const [company, setCompany] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [topic, setTopic] = useState('All');
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({ easy: 0, medium: 0, hard: 0, total: 0 });

  const normalizeCompanyName = (name) => (name === 'Facebook' ? 'Meta' : name);

  const fetchFilterMeta = useCallback(async () => {
    try {
      const [{ data: companyData }, { data: topicData }] = await Promise.all([
        api.get('/dsa/company-stats'),
        api.get('/dsa/topics')
      ]);

      const companyList = (companyData?.stats || [])
        .map((s) => normalizeCompanyName(s._id))
        .filter(Boolean);
      const uniqueCompanies = [...new Set(companyList)];
      if (uniqueCompanies.length) setCompanies(['All', ...uniqueCompanies]);

      const topicList = (topicData?.topics || []).filter(Boolean).sort((a, b) => a.localeCompare(b));
      if (topicList.length) setTopics(['All', ...topicList]);
    } catch {
      // Keep default filters if API metadata fetch fails.
    }
  }, []);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 200 };
      if (company !== 'All') params.company = company;
      if (difficulty !== 'All') params.difficulty = difficulty;
      if (topic !== 'All') params.topic = topic;
      if (status !== 'All') params.status = status.toLowerCase();
      if (search) params.search = search;
      const { data } = await api.get('/dsa/questions', { params });
      const qs = data.questions || [];
      setQuestions(qs);
      setTotal(data.total || qs.length);
      const solved = qs.filter(q => q.solved);
      setStats({
        easy: solved.filter(q => q.difficulty === 'Easy').length,
        medium: solved.filter(q => q.difficulty === 'Medium').length,
        hard: solved.filter(q => q.difficulty === 'Hard').length,
        total: solved.length
      });
    } catch { }
    setLoading(false);
  }, [company, difficulty, topic, status, search]);

  useEffect(() => { fetchFilterMeta(); }, [fetchFilterMeta]);
  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const pickRandom = async () => {
    try {
      const params = {};
      if (company !== 'All') params.company = company;
      if (difficulty !== 'All') params.difficulty = difficulty;
      const { data } = await api.get('/dsa/questions/random', { params });
      if (data.questionId) navigate(`/compiler/${data.questionId}`);
    } catch { }
  };

  const diffCounts = { Easy: 0, Medium: 0, Hard: 0 };
  questions.forEach(q => { if (diffCounts[q.difficulty] !== undefined) diffCounts[q.difficulty]++; });

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-fade-in pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>DSA Problems</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{stats.total} solved · {total} total</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(p => !p)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
            style={{ background: showFilters ? '#7c3aed20' : 'var(--bg-card)', color: showFilters ? '#7c3aed' : 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            <Filter size={15} /> Filters
          </button>
          <button onClick={pickRandom} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
            style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            <Shuffle size={15} /> Random
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex items-center gap-6 mb-3">
          <div className="text-center">
            <div className="text-3xl font-black gradient-text">{stats.total}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Solved</div>
          </div>
          <div className="flex-1 space-y-1.5">
            {['Easy', 'Medium', 'Hard'].map(d => (
              <div key={d} className="flex items-center gap-2 text-xs">
                <span className="w-14 font-medium" style={{ color: DIFF_COLORS[d] }}>{d}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${diffCounts[d] ? (stats[d.toLowerCase()] / diffCounts[d]) * 100 : 0}%`, background: DIFF_COLORS[d] }} />
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>{stats[d.toLowerCase()]}/{diffCounts[d]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search problems..."
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
      </div>

      {/* Company quick chips */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {companies.map(c => (
          <button key={c} onClick={() => setCompany(c)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
            style={{
              background: company === c ? `${COMPANY_COLORS[c] || '#7c3aed'}20` : 'var(--bg-card)',
              color: company === c ? (COMPANY_COLORS[c] || '#7c3aed') : 'var(--text-secondary)',
              border: `1px solid ${company === c ? (COMPANY_COLORS[c] || '#7c3aed') + '50' : 'var(--border)'}`
            }}>
            {c !== 'All' && COMPANY_ICONS[c]} {c}
          </button>
        ))}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="card space-y-4">
          <div>
            <div className="text-xs font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>DIFFICULTY</div>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: difficulty === d ? (d === 'All' ? '#7c3aed' : DIFF_BG[d]) : 'var(--bg-primary)',
                    color: difficulty === d ? (d === 'All' ? '#fff' : DIFF_COLORS[d]) : 'var(--text-secondary)',
                    border: `1px solid ${difficulty === d ? (d === 'All' ? '#7c3aed' : DIFF_COLORS[d] + '50') : 'var(--border)'}`
                  }}>{d}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>STATUS</div>
            <div className="flex gap-2">
              {STATUSES.map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: status === s ? '#7c3aed20' : 'var(--bg-primary)',
                    color: status === s ? '#7c3aed' : 'var(--text-secondary)',
                    border: `1px solid ${status === s ? '#7c3aed40' : 'var(--border)'}`
                  }}>
                  {s === 'Solved' ? '✅ Solved' : s === 'Unsolved' ? '○ Unsolved' : 'All'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>TOPIC</div>
            <div className="flex flex-wrap gap-2">
              {topics.map(t => (
                <button key={t} onClick={() => setTopic(t)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: topic === t ? '#06b6d420' : 'var(--bg-primary)',
                    color: topic === t ? '#06b6d4' : 'var(--text-secondary)',
                    border: `1px solid ${topic === t ? '#06b6d440' : 'var(--border)'}`
                  }}>{t}</button>
              ))}
            </div>
          </div>
          <button onClick={() => { setCompany('All'); setDifficulty('All'); setTopic('All'); setStatus('All'); setSearch(''); }}
            className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <RotateCcw size={12} /> Reset all filters
          </button>
        </motion.div>
      )}

      {/* Problems table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          Array(8).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="skeleton w-4 h-4 rounded-full" />
              <div className="skeleton flex-1 h-4 rounded-lg" />
              <div className="skeleton w-16 h-5 rounded-full" />
              <div className="skeleton w-10 h-4 rounded" />
            </div>
          ))
        ) : questions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No problems found</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <>
            {/* Desktop header */}
            <div className="hidden md:grid px-5 py-2.5 border-b text-xs font-semibold"
              style={{ gridTemplateColumns: '28px 1fr 110px 85px 130px 90px', borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-primary)' }}>
              <div></div>
              <div>Title</div>
              <div>Difficulty</div>
              <div>Accept%</div>
              <div>Companies</div>
              <div>Topic</div>
            </div>

            {questions.map((q, i) => (
              <motion.div key={q._id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.015, 0.4) }}
                onClick={() => navigate(`/compiler/${q._id}`)}
                className="flex md:grid items-center gap-3 md:gap-4 px-5 py-3.5 border-b cursor-pointer transition-all hover:bg-purple-500/5 group"
                style={{ gridTemplateColumns: '28px 1fr 110px 85px 130px 90px', borderColor: 'var(--border)' }}>

                <div className="shrink-0">
                  {q.solved
                    ? <CheckCircle2 size={15} style={{ color: '#22c55e' }} />
                    : <Circle size={15} style={{ color: 'var(--border)' }} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium group-hover:text-purple-400 transition-colors truncate"
                    style={{ color: 'var(--text-primary)' }}>
                    {q.questionNumber && <span className="mr-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{q.questionNumber}.</span>}
                    {q.title}
                  </div>
                  {/* Mobile diff badge */}
                  <div className="flex items-center gap-2 mt-1 md:hidden">
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: DIFF_BG[q.difficulty], color: DIFF_COLORS[q.difficulty] }}>{q.difficulty}</span>
                    {(q.companies || []).slice(0, 2).map(c => (
                      <span key={c} className="text-xs" title={c}>{COMPANY_ICONS[c] || '🏢'}</span>
                    ))}
                  </div>
                </div>

                <div className="hidden md:block">
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{ background: DIFF_BG[q.difficulty], color: DIFF_COLORS[q.difficulty] }}>
                    {q.difficulty}
                  </span>
                </div>

                <div className="hidden md:block text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {q.acceptance ? `${q.acceptance}%` : '—'}
                </div>

                <div className="hidden md:flex gap-1 items-center flex-wrap">
                  {(q.companies || []).slice(0, 4).map(c => (
                    <span key={c} title={c} className="text-sm">{COMPANY_ICONS[c] || '🏢'}</span>
                  ))}
                  {(q.companies || []).length > 4 && (
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>+{q.companies.length - 4}</span>
                  )}
                </div>

                <div className="hidden md:block text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                  {q.topic}
                </div>
              </motion.div>
            ))}

            <div className="px-5 py-2.5 text-xs" style={{ color: 'var(--text-secondary)', background: 'var(--bg-primary)' }}>
              {questions.length} of {total} problems
            </div>
          </>
        )}
      </div>
    </div>
  );
}
