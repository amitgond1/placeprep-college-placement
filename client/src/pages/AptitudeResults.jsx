import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronDown, AlertCircle, CheckCircle2, XCircle, MessageCircle, X, Send } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../services/api';

const CUTOFFS = {
  mock_tcs_1: { label: 'TCS NQT', cutoff: 65 },
  mock_tcs_2: { label: 'TCS NQT', cutoff: 65 },
  mock_wipro_1: { label: 'Wipro NLTH', cutoff: 60 },
  mock_cognizant_1: { label: 'Cognizant GenC', cutoff: 60 },
  mock_accenture_1: { label: 'Accenture', cutoff: 70 },
  mock_capgemini_1: { label: 'Capgemini', cutoff: 60 },
};

export default function AptitudeResults() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [doubtModal, setDoubtModal] = useState(null);
  const [doubtQuery, setDoubtQuery] = useState('');
  const [doubtResponse, setDoubtResponse] = useState('');
  const [doubtLoading, setDoubtLoading] = useState(false);
  const [hinglish, setHinglish] = useState(false);

  useEffect(() => { fetchResult(); }, [resultId]);

  const fetchResult = async () => {
    try {
      const { data } = await api.get(`/aptitude/results/${resultId}`);
      setResult(data.result);
    } catch { toast.error('Result not found'); navigate('/aptitude'); }
    finally { setLoading(false); }
  };

  const askDoubt = async () => {
    if (!doubtQuery.trim()) return;
    setDoubtLoading(true);
    try {
      const { data } = await api.post('/aptitude/doubt', {
        questionText: doubtModal.questionText,
        explanation: doubtModal.explanation,
        userQuery: doubtQuery,
        language: hinglish ? 'hinglish' : 'english'
      });
      setDoubtResponse(data.response);
    } catch { toast.error('Failed to get AI response'); }
    finally { setDoubtLoading(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!result) return null;

  const accuracy = Math.round((result.score / result.totalQuestions) * 100);
  const timeTakenMin = Math.floor(result.timeTaken / 60);
  const cutoffInfo = CUTOFFS[result.mockId];
  const meetsСutoff = cutoffInfo ? accuracy >= cutoffInfo.cutoff : null;

  // Topic breakdown chart data
  const topicData = result.topicBreakdown
    ? Object.entries(Object.fromEntries(result.topicBreakdown)).map(([topic, v]) => ({
        topic: topic.length > 12 ? topic.substring(0, 12) + '..' : topic,
        accuracy: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
        correct: v.correct, total: v.total
      }))
    : [];

  const weakTopics = topicData.filter(t => t.accuracy < 50 && t.total > 0).map(t => t.topic);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20 md:pb-0">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/aptitude')} className="p-2 rounded-xl transition-colors hover:bg-purple-500/10"
          style={{ color: 'var(--text-secondary)' }}><ChevronLeft size={20} /></button>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Test Results</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{result.mockId?.replace(/_/g, ' ').toUpperCase()}</p>
        </div>
      </div>

      {/* Score Card */}
      <div className="card text-center">
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <div>
            <div className="text-5xl font-black" style={{ color: accuracy >= 70 ? '#22c55e' : accuracy >= 50 ? '#f59e0b' : '#ef4444' }}>
              {result.score}/{result.totalQuestions}
            </div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Score</div>
          </div>
          <div>
            <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{accuracy}%</div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Accuracy</div>
          </div>
          <div>
            <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{timeTakenMin}m</div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Time Taken</div>
          </div>
          <div>
            <div className="text-3xl font-bold" style={{ color: '#7c3aed' }}>~{result.percentile}%ile</div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Percentile</div>
          </div>
        </div>
        <div className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          You scored better than approximately <strong style={{ color: '#7c3aed' }}>{result.percentile}%</strong> of PlacePrep users
        </div>
        {cutoffInfo && (
          <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${meetsСutoff ? 'bg-green-500/15 text-green-600' : 'bg-red-500/15 text-red-500'}`}>
            {meetsСutoff ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {cutoffInfo.label} cutoff ~{cutoffInfo.cutoff}% — You scored {accuracy}% {meetsСutoff ? '✅' : '❌'}
          </div>
        )}
      </div>

      {/* Topic Breakdown Chart */}
      {topicData.length > 0 && (
        <div className="card">
          <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Topic-wise Performance</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topicData} margin={{ bottom: 40 }}>
              <XAxis dataKey="topic" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} angle={-35} textAnchor="end" />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} domain={[0, 100]} unit="%" />
              <Tooltip formatter={(v) => [`${v}%`, 'Accuracy']}
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                {topicData.map((entry, i) => (
                  <Cell key={i} fill={entry.accuracy >= 70 ? '#22c55e' : entry.accuracy >= 50 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Weak Topics */}
      {weakTopics.length > 0 && (
        <div className="card" style={{ borderColor: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
          <div className="flex items-start gap-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
            <div>
              <div className="font-semibold text-sm mb-2" style={{ color: '#ef4444' }}>Weak Topics Detected (below 50%)</div>
              <div className="flex flex-wrap gap-2">
                {weakTopics.map(t => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                    {t} — Practice Now
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question Review */}
      <div className="card">
        <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Question-by-Question Review</h2>
        <div className="space-y-2">
          {result.answers?.map((a, i) => {
            const q = a.questionId;
            if (!q) return null;
            return (
              <div key={i} className="rounded-xl border overflow-hidden"
                style={{ borderColor: a.isCorrect ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)' }}>
                <button className="w-full flex items-center gap-3 p-4 text-left"
                  onClick={() => setExpanded(expanded === i ? null : i)}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${a.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                    {i + 1}
                  </div>
                  <p className="flex-1 text-sm line-clamp-2" style={{ color: 'var(--text-primary)' }}>{q.questionText}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-bold ${a.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                      {a.isCorrect ? '✓' : '✗'}
                    </span>
                    <ChevronDown size={14} className={`transition-transform ${expanded === i ? 'rotate-180' : ''}`}
                      style={{ color: 'var(--text-secondary)' }} />
                  </div>
                </button>
                {expanded === i && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="grid sm:grid-cols-2 gap-3 mt-3">
                      <div className="p-3 rounded-xl text-sm" style={{ background: a.isCorrect ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
                        <div className="text-xs font-semibold mb-1" style={{ color: a.isCorrect ? '#22c55e' : '#ef4444' }}>Your Answer</div>
                        <div style={{ color: 'var(--text-primary)' }}>
                          {a.userAnswer || 'Not answered'}: {a.userAnswer && q.options?.['ABCD'.indexOf(a.userAnswer)]}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(34,197,94,0.1)' }}>
                        <div className="text-xs font-semibold mb-1 text-green-500">Correct Answer</div>
                        <div style={{ color: 'var(--text-primary)' }}>
                          {q.correctAnswer}: {q.options?.['ABCD'.indexOf(q.correctAnswer)]}
                        </div>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
                      <div className="text-xs font-semibold mb-1.5" style={{ color: '#06b6d4' }}>Step-by-step Explanation</div>
                      <p style={{ color: 'var(--text-secondary)' }}>{q.explanation}</p>
                    </div>
                    <button onClick={() => { setDoubtModal(q); setDoubtResponse(''); setDoubtQuery(''); }}
                      className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                      style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                      <MessageCircle size={13} /> Still confused? Ask AI
                    </button>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={() => navigate('/aptitude')} className="btn-primary">
        <ChevronLeft size={15} /> Back to Aptitude Prep
      </button>

      {/* Doubt Modal */}
      {doubtModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg p-6 rounded-2xl space-y-4 max-h-[80vh] overflow-y-auto"
            style={{ background: 'var(--bg-card)' }}>
            <div className="flex justify-between items-start">
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Ask AI — Claude</h3>
              <button onClick={() => setDoubtModal(null)}><X size={18} style={{ color: 'var(--text-secondary)' }} /></button>
            </div>
            <div className="p-3 rounded-xl text-sm" style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
              {doubtModal.questionText}
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <button onClick={() => setHinglish(p => !p)}
                className={`w-8 h-4 rounded-full transition-all relative ${hinglish ? 'bg-purple-600' : ''}`}
                style={!hinglish ? { background: 'var(--border)' } : {}}>
                <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${hinglish ? 'right-0.5' : 'left-0.5'}`} />
              </button>
              Explain in Hinglish
            </div>
            <div className="flex gap-2">
              <input value={doubtQuery} onChange={e => setDoubtQuery(e.target.value)}
                placeholder="Ask your doubt... e.g. Why did we multiply here?"
                className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-purple-500"
                style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                onKeyDown={e => e.key === 'Enter' && askDoubt()} />
              <button onClick={askDoubt} disabled={doubtLoading} className="btn-primary px-4 py-2.5 disabled:opacity-70">
                {doubtLoading ? '...' : <Send size={15} />}
              </button>
            </div>
            {doubtResponse && (
              <div className="p-4 rounded-xl text-sm leading-relaxed"
                style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                {doubtResponse}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
