import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ChevronLeft, ChevronDown, AlertCircle, CheckCircle2, XCircle,
  MessageCircle, X, Send, Clock, Target, TrendingUp, BookOpen,
  Lightbulb, BarChart3, Award, RotateCcw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import api from '../services/api';

const CUTOFFS = {
  mock_tcs_1: { label: 'TCS NQT', cutoff: 65 },
  mock_tcs_2: { label: 'TCS NQT', cutoff: 65 },
  mock_wipro_1: { label: 'Wipro NLTH', cutoff: 60 },
  mock_cognizant_1: { label: 'Cognizant GenC', cutoff: 60 },
  mock_accenture_1: { label: 'Accenture', cutoff: 70 },
  mock_capgemini_1: { label: 'Capgemini', cutoff: 60 },
  mock_infosys_1: { label: 'Infosys InfyTQ', cutoff: 65 },
  mock_hcl_1: { label: 'HCL TechBee', cutoff: 60 },
  mock_zoho_1: { label: 'Zoho', cutoff: 80 },
};

function getTopicEntries(topicBreakdown) {
  if (!topicBreakdown) return [];
  if (topicBreakdown instanceof Map) return Array.from(topicBreakdown.entries());
  if (Array.isArray(topicBreakdown)) return topicBreakdown;
  if (typeof topicBreakdown === 'object') return Object.entries(topicBreakdown);
  return [];
}

// Parse explanation into numbered steps (split on ". " boundaries for multi-sentence explanations)
function parseExplanationSteps(explanation) {
  if (!explanation) return [];
  // Split on step markers like "Step 1:", numbered points, or sentence boundaries
  const stepPatterns = /(?:Step\s*\d+[:.]\s*|\d+[.)]\s*)/gi;
  if (stepPatterns.test(explanation)) {
    return explanation.split(/(?:Step\s*\d+[:.]\s*|\d+[.)]\s*)/i).filter(s => s.trim()).map(s => s.trim());
  }
  // Split on ". " for multi-sentence explanations
  const sentences = explanation.split(/\.\s+/).filter(s => s.trim().length > 5);
  return sentences.length > 1 ? sentences : [explanation];
}

function ScoreRing({ score, total, color }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const r = 40, circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 50 50)" style={{ transition: 'stroke-dasharray 1s ease' }} />
        <text x="50" y="46" textAnchor="middle" fontSize="18" fontWeight="800" fill={color}>{pct}%</text>
        <text x="50" y="62" textAnchor="middle" fontSize="11" fill="var(--text-secondary)">{score}/{total}</text>
      </svg>
    </div>
  );
}

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
  const [filterStatus, setFilterStatus] = useState('all'); // all | wrong | correct | skipped
  const [activeTab, setActiveTab] = useState('overview'); // overview | review

  useEffect(() => { fetchResult(); }, [resultId]);

  const fetchResult = async () => {
    try {
      const { data } = await api.get(`/aptitude/results/${resultId}`);
      setResult(data.result);
    } catch {
      toast.error('Result not found');
      navigate('/aptitude');
    } finally {
      setLoading(false);
    }
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
    } catch {
      toast.error('Failed to get AI response');
    } finally {
      setDoubtLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!result) return null;

  const accuracy = result.totalQuestions > 0 ? Math.round((result.score / result.totalQuestions) * 100) : 0;
  const timeTakenMin = Math.floor((result.timeTaken || 0) / 60);
  const timeTakenSec = (result.timeTaken || 0) % 60;
  const cutoffInfo = CUTOFFS[result.mockId];
  const meetsCutoff = cutoffInfo ? accuracy >= cutoffInfo.cutoff : null;

  const topicData = getTopicEntries(result.topicBreakdown).map(([topic, value]) => {
    const total = Number(value?.total || 0);
    const correct = Number(value?.correct || 0);
    return {
      topic: topic.length > 14 ? `${topic.substring(0, 14)}..` : topic,
      fullTopic: topic,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      correct, total
    };
  });

  const weakTopics = topicData.filter(t => t.accuracy < 50 && t.total > 0);
  const strongTopics = topicData.filter(t => t.accuracy >= 70 && t.total > 0);

  const correctCount = result.answers?.filter(a => a.isCorrect).length || 0;
  const wrongCount = result.answers?.filter(a => !a.isCorrect && a.userAnswer).length || 0;
  const skippedCount = result.answers?.filter(a => !a.userAnswer).length || 0;

  const filteredAnswers = (result.answers || []).filter(a => {
    if (filterStatus === 'correct') return a.isCorrect;
    if (filterStatus === 'wrong') return !a.isCorrect && a.userAnswer;
    if (filterStatus === 'skipped') return !a.userAnswer;
    return true;
  });

  const scoreColor = accuracy >= 70 ? '#22c55e' : accuracy >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in pb-24 md:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/aptitude')}
          className="p-2 rounded-xl transition-colors hover:bg-purple-500/10" style={{ color: 'var(--text-secondary)' }}>
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Test Results</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {result.mockId?.replace(/_/g, ' ').toUpperCase()}
          </p>
        </div>
      </div>

      {/* Score Hero Card */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ScoreRing score={result.score} total={result.totalQuestions} color={scoreColor} />

          <div className="flex-1 w-full">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { icon: CheckCircle2, label: 'Correct', value: correctCount, color: '#22c55e' },
                { icon: XCircle, label: 'Wrong', value: wrongCount, color: '#ef4444' },
                { icon: AlertCircle, label: 'Skipped', value: skippedCount, color: '#f59e0b' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="rounded-xl p-3 text-center" style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
                  <Icon size={16} className="mx-auto mb-1" style={{ color }} />
                  <div className="text-lg font-black" style={{ color }}>{value}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <Clock size={14} style={{ color: '#7c3aed' }} />
                {timeTakenMin}m {timeTakenSec}s
              </div>
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <TrendingUp size={14} style={{ color: '#06b6d4' }} />
                ~{result.percentile}%ile
              </div>
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <Target size={14} style={{ color: '#f59e0b' }} />
                {accuracy}% accuracy
              </div>
            </div>
          </div>
        </div>

        {cutoffInfo && (
          <div className={`mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold w-fit ${meetsCutoff ? 'text-green-500' : 'text-red-500'}`}
            style={{ background: meetsCutoff ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
            {meetsCutoff ? <Award size={16} /> : <XCircle size={16} />}
            {cutoffInfo.label} cutoff: ~{cutoffInfo.cutoff}% — You scored {accuracy}% {meetsCutoff ? '✅ PASS' : '❌ Need improvement'}
          </div>
        )}

        <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          You scored better than approximately <strong style={{ color: '#7c3aed' }}>{result.percentile}%</strong> of PlacePrep users
        </p>
      </div>

      {/* Tabs: Overview / Question Review */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {[['overview', BarChart3, 'Analysis'], ['review', BookOpen, 'Question Review']].map(([id, Icon, label]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={activeTab === id
              ? { background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: 'white' }
              : { color: 'var(--text-secondary)' }}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* ─── ANALYSIS TAB ─── */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Topic performance bar chart */}
          {topicData.length > 0 && (
            <div className="card">
              <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <BarChart3 size={16} style={{ color: '#7c3aed' }} /> Topic-wise Performance
              </h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topicData} margin={{ bottom: 50 }}>
                  <XAxis dataKey="topic" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} angle={-35} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} domain={[0, 100]} unit="%" />
                  <Tooltip
                    formatter={(v, n, p) => [`${v}% (${p.payload.correct}/${p.payload.total})`, 'Accuracy']}
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="accuracy" radius={[5, 5, 0, 0]}>
                    {topicData.map((entry, i) => (
                      <Cell key={i} fill={entry.accuracy >= 70 ? '#22c55e' : entry.accuracy >= 50 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Strong / Weak split */}
          {(weakTopics.length > 0 || strongTopics.length > 0) && (
            <div className="grid sm:grid-cols-2 gap-4">
              {strongTopics.length > 0 && (
                <div className="card" style={{ borderColor: 'rgba(34,197,94,0.3)', border: '1px solid' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={16} style={{ color: '#22c55e' }} />
                    <span className="font-semibold text-sm" style={{ color: '#22c55e' }}>Strong Topics</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {strongTopics.map(t => (
                      <span key={t.fullTopic} className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
                        {t.fullTopic} — {t.accuracy}%
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {weakTopics.length > 0 && (
                <div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)', border: '1px solid' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={16} style={{ color: '#ef4444' }} />
                    <span className="font-semibold text-sm" style={{ color: '#ef4444' }}>Needs Improvement</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {weakTopics.map(t => (
                      <span key={t.fullTopic} className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
                        {t.fullTopic} — {t.accuracy}%
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Improvement tip */}
          {weakTopics.length > 0 && (
            <div className="card" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <div className="flex items-start gap-3">
                <Lightbulb size={18} style={{ color: '#7c3aed' }} className="shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm mb-1" style={{ color: '#7c3aed' }}>Study Recommendation</div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Focus on <strong style={{ color: 'var(--text-primary)' }}>{weakTopics.map(t => t.fullTopic).join(', ')}</strong>.
                    Use the <strong style={{ color: '#7c3aed' }}>Study Guide</strong> tab for formulas & shortcuts, then practice using <strong style={{ color: '#7c3aed' }}>Topic Drill</strong>.
                  </p>
                  <button onClick={() => navigate('/aptitude?tab=guide')}
                    className="mt-2 text-xs px-3 py-1.5 rounded-lg font-medium"
                    style={{ background: 'rgba(124,58,237,0.15)', color: '#7c3aed' }}>
                    Open Study Guide →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── QUESTION REVIEW TAB ─── */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: `All (${result.answers?.length || 0})`, color: '#7c3aed' },
              { id: 'correct', label: `✅ Correct (${correctCount})`, color: '#22c55e' },
              { id: 'wrong', label: `❌ Wrong (${wrongCount})`, color: '#ef4444' },
              { id: 'skipped', label: `⏭ Skipped (${skippedCount})`, color: '#f59e0b' },
            ].map(f => (
              <button key={f.id} onClick={() => setFilterStatus(f.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: filterStatus === f.id ? `${f.color}20` : 'var(--bg-card)',
                  color: filterStatus === f.id ? f.color : 'var(--text-secondary)',
                  border: `1px solid ${filterStatus === f.id ? f.color + '50' : 'var(--border)'}`
                }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Questions */}
          <div className="space-y-3">
            {filteredAnswers.map((a, idx) => {
              const q = a.questionId;
              if (!q) return null;
              const globalIdx = (result.answers || []).indexOf(a);
              const steps = parseExplanationSteps(q.explanation);
              const isExpanded = expanded === globalIdx;
              const userAnsText = a.userAnswer ? `${a.userAnswer}. ${q.options?.['ABCD'.indexOf(a.userAnswer)] || ''}` : 'Not answered';
              const correctAnsText = `${q.correctAnswer}. ${q.options?.['ABCD'.indexOf(q.correctAnswer)] || ''}`;

              return (
                <div key={globalIdx} className="rounded-2xl overflow-hidden"
                  style={{ border: `1px solid ${a.isCorrect ? 'rgba(34,197,94,0.3)' : !a.userAnswer ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                  {/* Question header */}
                  <button className="w-full flex items-start gap-3 p-4 text-left"
                    onClick={() => setExpanded(isExpanded ? null : globalIdx)}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5
                      ${a.isCorrect ? 'bg-green-500' : !a.userAnswer ? 'bg-yellow-500' : 'bg-red-500'}`}>
                      {globalIdx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{q.questionText}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}>
                          {q.topic}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{
                          background: q.difficulty === 'Easy' ? 'rgba(34,197,94,0.1)' : q.difficulty === 'Hard' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                          color: q.difficulty === 'Easy' ? '#22c55e' : q.difficulty === 'Hard' ? '#ef4444' : '#f59e0b'
                        }}>
                          {q.difficulty}
                        </span>
                      </div>
                    </div>
                    <ChevronDown size={16} className={`transition-transform shrink-0 mt-1 ${isExpanded ? 'rotate-180' : ''}`}
                      style={{ color: 'var(--text-secondary)' }} />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: 'var(--border)' }}>

                          {/* Options list */}
                          <div className="grid sm:grid-cols-2 gap-2 mt-3">
                            {['A','B','C','D'].map((opt, oi) => {
                              const isUser = a.userAnswer === opt;
                              const isCorrect = q.correctAnswer === opt;
                              let bg = 'var(--bg-primary)', border = 'var(--border)', textColor = 'var(--text-primary)';
                              if (isCorrect) { bg = 'rgba(34,197,94,0.12)'; border = '#22c55e'; textColor = '#22c55e'; }
                              else if (isUser && !isCorrect) { bg = 'rgba(239,68,68,0.12)'; border = '#ef4444'; textColor = '#ef4444'; }
                              return (
                                <div key={opt} className="flex items-center gap-2 p-2.5 rounded-xl text-sm"
                                  style={{ background: bg, border: `1px solid ${border}`, color: textColor }}>
                                  <span className="font-bold w-5 shrink-0">{opt}.</span>
                                  <span className="flex-1">{q.options?.[oi]}</span>
                                  {isCorrect && <CheckCircle2 size={14} style={{ color: '#22c55e' }} className="shrink-0" />}
                                  {isUser && !isCorrect && <XCircle size={14} style={{ color: '#ef4444' }} className="shrink-0" />}
                                </div>
                              );
                            })}
                          </div>

                          {/* Your answer / Correct answer row */}
                          {!a.isCorrect && (
                            <div className="grid sm:grid-cols-2 gap-2">
                              <div className="p-2.5 rounded-xl text-xs" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                                <div className="font-semibold mb-0.5" style={{ color: '#ef4444' }}>Your Answer</div>
                                <div style={{ color: 'var(--text-primary)' }}>{userAnsText}</div>
                              </div>
                              <div className="p-2.5 rounded-xl text-xs" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
                                <div className="font-semibold mb-0.5" style={{ color: '#22c55e' }}>Correct Answer</div>
                                <div style={{ color: 'var(--text-primary)' }}>{correctAnsText}</div>
                              </div>
                            </div>
                          )}

                          {/* Step-by-step explanation */}
                          {q.explanation && (
                            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(6,182,212,0.25)' }}>
                              <div className="px-3 py-2 flex items-center gap-2" style={{ background: 'rgba(6,182,212,0.1)' }}>
                                <Lightbulb size={14} style={{ color: '#06b6d4' }} />
                                <span className="text-xs font-bold" style={{ color: '#06b6d4' }}>Step-by-Step Solution</span>
                              </div>
                              <div className="p-3 space-y-2" style={{ background: 'rgba(6,182,212,0.04)' }}>
                                {steps.length > 1 ? steps.map((step, si) => (
                                  <div key={si} className="flex items-start gap-2.5 text-xs">
                                    <span className="w-5 h-5 rounded-full text-white flex items-center justify-center shrink-0 font-bold text-[10px]"
                                      style={{ background: '#06b6d4' }}>{si + 1}</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>{step}{!step.endsWith('.') ? '.' : ''}</span>
                                  </div>
                                )) : (
                                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{q.explanation}</p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Avg time */}
                          {q.avgTimeSeconds && (
                            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                              <Clock size={12} /> Expected solve time: ~{q.avgTimeSeconds}s
                            </div>
                          )}

                          {/* Ask AI */}
                          <button onClick={() => { setDoubtModal(q); setDoubtResponse(''); setDoubtQuery(''); }}
                            className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg font-medium transition-colors"
                            style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                            <MessageCircle size={13} /> Still confused? Ask AI
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {filteredAnswers.length === 0 && (
              <div className="text-center py-10 text-sm" style={{ color: 'var(--text-secondary)' }}>
                No questions match this filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex flex-wrap gap-3">
        <button onClick={() => navigate('/aptitude')} className="btn-primary">
          <ChevronLeft size={15} /> Back to Aptitude
        </button>
        <button onClick={() => navigate(`/aptitude/mock/${result.mockId}`)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
          <RotateCcw size={14} /> Retake Test
        </button>
      </div>

      {/* AI Doubt Modal */}
      {doubtModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg p-6 rounded-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-start">
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>🤖 Ask AI — Claude</h3>
              <button onClick={() => setDoubtModal(null)}><X size={18} style={{ color: 'var(--text-secondary)' }} /></button>
            </div>

            <div className="p-3 rounded-xl text-sm" style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
              {doubtModal.questionText}
            </div>

            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <button onClick={() => setHinglish(p => !p)}
                className="w-9 h-5 rounded-full transition-all relative shrink-0"
                style={{ background: hinglish ? '#7c3aed' : 'var(--border)' }}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${hinglish ? 'right-0.5' : 'left-0.5'}`} />
              </button>
              Explain in Hinglish
            </div>

            <div className="flex gap-2">
              <input value={doubtQuery} onChange={e => setDoubtQuery(e.target.value)}
                placeholder="Ask your doubt… e.g. Why do we multiply here?"
                className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-purple-500"
                style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                onKeyDown={e => e.key === 'Enter' && askDoubt()} />
              <button onClick={askDoubt} disabled={doubtLoading} className="btn-primary px-4 py-2.5 disabled:opacity-70">
                {doubtLoading ? '...' : <Send size={15} />}
              </button>
            </div>

            {doubtResponse && (
              <div className="p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap"
                style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', color: 'var(--text-secondary)' }}>
                {doubtResponse}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
