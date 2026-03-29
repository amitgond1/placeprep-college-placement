import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Play, Send, ChevronDown, Clock, Lightbulb,
  ThumbsUp, ChevronRight, X, Copy, RotateCcw, Maximize2,
  Keyboard, CheckCircle2, XCircle, AlertCircle, Timer,
  BookOpen, MessageSquare, History, Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LANGS = [
  { id: 'cpp', label: 'C++ 17', monacoLang: 'cpp', icon: '🔵', color: '#00599C' },
  { id: 'java', label: 'Java', monacoLang: 'java', icon: '🟠', color: '#ED8B00' },
  { id: 'python', label: 'Python 3', monacoLang: 'python', icon: '🟡', color: '#FFD43B' },
];

const DIFF_COLORS = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };
const DIFF_BG = { Easy: '#22c55e15', Medium: '#f59e0b15', Hard: '#ef444415' };

const COMPANY_COLORS = {
  Amazon: '#FF9900', Google: '#4285F4', Microsoft: '#00A4EF',
  Meta: '#1877F2', Apple: '#555555', Netflix: '#E50914',
  Flipkart: '#2874F0', Zoho: '#C8202D', TCS: '#003087',
  Wipro: '#341C5B', Infosys: '#007CC3', Cognizant: '#0033A0',
};

const SHORTCUTS = [
  { key: 'Ctrl + Enter', desc: 'Run Code' },
  { key: 'Ctrl + Shift + Enter', desc: 'Submit' },
  { key: 'Ctrl + /', desc: 'Toggle comment' },
  { key: 'Ctrl + Z', desc: 'Undo' },
  { key: 'Ctrl + F', desc: 'Find in editor' },
  { key: 'Ctrl + `', desc: 'Toggle bottom panel' },
  { key: 'Alt + ↑/↓', desc: 'Move line up/down' },
];

function useTimer() {
  const [seconds, setSeconds] = useState(0);
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (active) ref.current = setInterval(() => setSeconds(s => s + 1), 1000);
    else clearInterval(ref.current);
    return () => clearInterval(ref.current);
  }, [active]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  return { seconds, active, fmt, start: () => setActive(true), stop: () => setActive(false), reset: () => { setActive(false); setSeconds(0); } };
}

export default function Compiler() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const timer = useTimer();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('cpp');
  const [code, setCode] = useState('');
  const [leftTab, setLeftTab] = useState('description');
  const [bottomTab, setBottomTab] = useState('testcase');
  const [bottomHeight, setBottomHeight] = useState(220);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showLangModal, setShowLangModal] = useState(null);
  const [showLangDrop, setShowLangDrop] = useState(false);
  const [customCases, setCustomCases] = useState([]);
  const [activeCase, setActiveCase] = useState(0);
  const [solutions, setSolutions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [viewCode, setViewCode] = useState(null);
  const [postSol, setPostSol] = useState(false);
  const [postForm, setPostForm] = useState({ title: '', explanation: '' });
  const [isDragging, setIsDragging] = useState(false);
  const [solved, setSolved] = useState(false);
  const dragStartY = useRef(0);
  const dragStartH = useRef(0);
  const editorRef = useRef(null);

  // Load question
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/dsa/questions/${id}`).then(({ data }) => {
      setQuestion(data.question);
      setSolved(data.question.solved);
      const cases = (data.question.testCases || []).slice(0, 3);
      setCustomCases(cases.length ? cases : [{ input: '', output: '' }]);
      loadCode(lang, data.question);
      setLoading(false);
    }).catch(() => { toast.error('Failed to load question'); setLoading(false); });
  }, [id]);

  // Load code from localStorage
  const loadCode = (language, q = question) => {
    if (!q) return;
    const saved = localStorage.getItem(`placeprep_code_${id}_${language}`);
    if (saved) { setCode(saved); return; }
    setCode(q.starterCode?.[language] || getDefaultStarter(language));
  };

  const getDefaultStarter = (language) => {
    if (language === 'cpp') return '#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution here\n};\n\nint main() {\n    // Test your code\n    return 0;\n}';
    if (language === 'java') return 'import java.util.*;\n\nclass Solution {\n    // Write your solution here\n}\n';
    return '# Write your solution here\n\nclass Solution:\n    pass\n';
  };

  const saveCode = (language, value) => {
    localStorage.setItem(`placeprep_code_${id}_${language}`, value);
  };

  // Language switch
  const handleLangSwitch = (newLang) => {
    const currentCode = code;
    const savedCurrent = localStorage.getItem(`placeprep_code_${id}_${lang}`);
    if (currentCode !== getDefaultStarter(lang) || savedCurrent) {
      setShowLangModal(newLang);
    } else {
      applyLangSwitch(newLang);
    }
    setShowLangDrop(false);
  };

  const applyLangSwitch = (newLang) => {
    saveCode(lang, code);
    setLang(newLang);
    loadCode(newLang);
    setShowLangModal(null);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleRun(); }
      if (e.ctrlKey && e.shiftKey && e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
      if (e.ctrlKey && e.key === '`') { e.preventDefault(); setBottomHeight(h => h > 50 ? 0 : 220); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [code, lang, activeCase]);

  // Bottom panel drag resize
  const onDragStart = (e) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartH.current = bottomHeight;
  };
  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging) return;
      const delta = dragStartY.current - e.clientY;
      setBottomHeight(Math.min(500, Math.max(80, dragStartH.current + delta)));
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [isDragging]);

  // Run code
  const handleRun = async () => {
    if (!code.trim()) return;
    setRunning(true);
    setBottomTab('result');
    try {
      const currentInput = customCases[activeCase]?.input || '';
      const { data } = await api.post(`/dsa/run/${id}`, { code, language: lang, customInput: currentInput });
      setRunResult({ ...data, testedInput: currentInput });
    } catch (err) {
      toast.error('Run failed');
      setRunResult({ error: true, stderr: err.response?.data?.message || 'Execution failed' });
    }
    setRunning(false);
  };

  // Submit
  const handleSubmit = async () => {
    if (!code.trim()) return;
    setSubmitting(true);
    setBottomTab('result');
    setSubmitResult(null);
    setRunResult(null);
    try {
      const { data } = await api.post(`/dsa/submit/${id}`, { code, language: lang });
      setSubmitResult(data);
      if (data.allPassed) {
        setSolved(true);
        setShowSuccessModal(true);
        launchConfetti();
        if (leftTab === 'submissions') fetchSubmissions();
      } else {
        // Load failed test into custom cases
        if (data.firstFailed) {
          const newCase = { input: data.firstFailed.input, output: data.firstFailed.expectedOutput };
          setCustomCases(prev => {
            const updated = [...prev];
            const idx = updated.findIndex(c => !c.output || c.output === newCase.output);
            if (idx >= 0) { updated[idx] = newCase; setActiveCase(idx); }
            else { updated.push(newCase); setActiveCase(updated.length - 1); }
            return updated;
          });
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Submit failed';
      setSubmitResult({ errorMessage: msg });
      toast.error(msg);
    }
    setSubmitting(false);
  };

  const handleMarkSolved = async () => {
    try {
      await api.post(`/dsa/mark-solved/${id}`);
      setSolved(true);
      setShowSuccessModal(true);
      launchConfetti();
      toast.success('Marked as solved! 🎉');
    } catch {
      toast.error('Failed to mark as solved');
    }
  };

  // Load solutions/submissions
  const fetchSolutions = useCallback(async () => {
    if (!id) return;
    const { data } = await api.get(`/solutions/${id}`);
    setSolutions(data.solutions || []);
  }, [id]);

  const fetchSubmissions = useCallback(async () => {
    if (!id) return;
    const { data } = await api.get(`/dsa/submissions/${id}`);
    setSubmissions(data.submissions || []);
  }, [id]);

  useEffect(() => {
    if (leftTab === 'solutions') fetchSolutions();
    if (leftTab === 'submissions') fetchSubmissions();
  }, [leftTab]);

  // Post solution
  const handlePostSolution = async () => {
    try {
      await api.post(`/solutions/${id}`, { code, language: lang, ...postForm });
      toast.success('Solution posted!');
      setPostSol(false);
      fetchSolutions();
    } catch { toast.error('Failed to post solution'); }
  };

  // Upvote solution
  const upvoteSolution = async (solId) => {
    try {
      const { data } = await api.put(`/solutions/${solId}/upvote`);
      setSolutions(prev => prev.map(s => s._id === solId ? { ...s, upvotes: data.upvotes } : s));
    } catch {}
  };

  // Confetti
  const launchConfetti = () => {
    import('canvas-confetti').then(({ default: confetti }) => {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#7c3aed', '#06b6d4', '#22c55e'] });
    }).catch(() => {});
  };

  const langInfo = LANGS.find(l => l.id === lang);
  const diff = question?.difficulty;
  const isBusy = running || submitting;
  const noTestCases = !question?.testCases?.length;

  if (loading) return (
    <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p style={{ color: 'var(--text-secondary)' }}>Loading problem...</p>
      </div>
    </div>
  );

  if (!question) return (
    <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <XCircle size={48} style={{ color: '#ef4444' }} className="mx-auto mb-3" />
        <p style={{ color: 'var(--text-primary)' }}>Problem not found</p>
        <button onClick={() => navigate('/dsa')} className="btn-primary mt-4">Back to Problems</button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* TOP NAVBAR */}
      <div className="flex items-center gap-3 px-4 h-12 border-b shrink-0" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <button onClick={() => navigate('/dsa')} className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Problems
        </button>
        <div className="w-px h-5" style={{ background: 'var(--border)' }} />
        <span className="text-sm font-semibold truncate max-w-[300px]" style={{ color: 'var(--text-primary)' }}>{question.title}</span>
        <span className="px-2 py-0.5 rounded-full text-xs font-bold"
          style={{ background: DIFF_BG[diff], color: DIFF_COLORS[diff] }}>{diff}</span>
        <div className="flex gap-1.5 ml-1">
          {(question.companies || []).slice(0, 3).map(c => (
            <span key={c} className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: `${COMPANY_COLORS[c] || '#7c3aed'}20`, color: COMPANY_COLORS[c] || '#7c3aed' }}>{c}</span>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          {/* Timer */}
          <button onClick={() => timer.active ? timer.stop() : timer.start()}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: timer.active ? '#7c3aed20' : 'var(--border)', color: timer.active ? '#7c3aed' : 'var(--text-secondary)' }}>
            <Timer size={14} />
            <span className="font-mono">{timer.fmt(timer.seconds)}</span>
          </button>
          {timer.seconds > 0 && <button onClick={timer.reset} className="text-xs" style={{ color: 'var(--text-secondary)' }}>Reset</button>}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="flex flex-col border-r overflow-hidden" style={{ width: '45%', borderColor: 'var(--border)' }}>
          {/* Left tabs */}
          <div className="flex border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
            {[
              { id: 'description', icon: BookOpen, label: 'Description' },
              { id: 'editorial', icon: Lightbulb, label: 'Editorial' },
              { id: 'solutions', icon: Users, label: 'Solutions' },
              { id: 'submissions', icon: History, label: 'Submissions' },
            ].map(tab => (
              <button key={tab.id}
                onClick={() => setLeftTab(tab.id)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors"
                style={{
                  borderBottomColor: leftTab === tab.id ? '#7c3aed' : 'transparent',
                  color: leftTab === tab.id ? '#7c3aed' : 'var(--text-secondary)'
                }}>
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5 text-sm" style={{ color: 'var(--text-primary)' }}>
            {/* DESCRIPTION TAB */}
            {leftTab === 'description' && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-xl font-bold mb-2">{question.questionNumber && <span className="text-gray-400 mr-2">{question.questionNumber}.</span>}{question.title}</h1>
                  <div className="flex items-center gap-3 text-xs mb-4">
                    <span className="px-2 py-1 rounded-full font-bold" style={{ background: DIFF_BG[diff], color: DIFF_COLORS[diff] }}>{diff}</span>
                    {question.acceptance && <span style={{ color: 'var(--text-secondary)' }}>Acceptance: {question.acceptance}%</span>}
                    {solved && <span className="flex items-center gap-1 text-green-400"><CheckCircle2 size={13} /> Solved</span>}
                  </div>
                  <div className="leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}
                    dangerouslySetInnerHTML={{ __html: question.description?.replace(/\n/g, '<br/>') || '' }} />
                </div>

                {(question.examples || []).map((ex, i) => (
                  <div key={i} className="rounded-xl p-4" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                    <div className="font-bold mb-2 text-xs" style={{ color: '#7c3aed' }}>Example {i + 1}:</div>
                    <div className="font-mono text-xs space-y-1">
                      <div><span style={{ color: 'var(--text-secondary)' }}>Input: </span><span>{ex.input}</span></div>
                      <div><span style={{ color: 'var(--text-secondary)' }}>Output: </span><span className="text-green-400">{ex.output}</span></div>
                      {ex.explanation && <div style={{ color: 'var(--text-secondary)' }}>Explanation: {ex.explanation}</div>}
                    </div>
                  </div>
                ))}

                {(question.constraints || []).length > 0 && (
                  <div>
                    <div className="font-bold mb-2">Constraints:</div>
                    <ul className="space-y-1">
                      {question.constraints.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                          <span className="mt-1 shrink-0" style={{ color: '#7c3aed' }}>•</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(question.hints || []).length > 0 && (
                  <div>
                    <div className="font-bold mb-2 flex items-center gap-2"><Lightbulb size={15} style={{ color: '#f59e0b' }} /> Hints</div>
                    <div className="space-y-2">
                      {question.hints.map((h, i) => (
                        <details key={i} className="rounded-lg p-3 cursor-pointer" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                          <summary className="text-xs font-medium select-none" style={{ color: '#f59e0b' }}>Hint {i + 1}</summary>
                          <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{h}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

                {/* LeetCode link + no test cases notice */}
                {(question.leetcodeLink || noTestCases) && (
                  <div className="space-y-2 pt-1">
                    {question.leetcodeLink && (
                      <a href={question.leetcodeLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-medium hover:underline"
                        style={{ color: '#f59e0b' }}>
                        <span>🔗</span> Open on LeetCode ↗
                      </a>
                    )}
                    {noTestCases && (
                      <div className="rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                        <p className="text-xs leading-relaxed" style={{ color: '#f59e0b' }}>
                          ⚠️ Automated judge not configured for this question. Write your solution, verify it on LeetCode, then click <strong>Mark Solved</strong>.
                        </p>
                        <button onClick={handleMarkSolved}
                          className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                          style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: '#fff' }}>
                          <CheckCircle2 size={11} /> Mark as Solved
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Company info */}
                <div className="pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(question.companies || []).map(c => (
                      <span key={c} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                        style={{ background: `${COMPANY_COLORS[c] || '#7c3aed'}15`, color: COMPANY_COLORS[c] || '#7c3aed', border: `1px solid ${COMPANY_COLORS[c] || '#7c3aed'}30` }}>
                        🔥 {c} · {question.frequency} times
                      </span>
                    ))}
                  </div>
                  {(question.topics || [question.topic]).filter(Boolean).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(question.topics || [question.topic]).filter(Boolean).map(t => (
                        <span key={t} className="px-2 py-1 rounded-lg text-xs"
                          style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}>{t}</span>
                      ))}
                    </div>
                  )}
                  {(question.similarQuestions || []).length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Similar Questions:</div>
                      <div className="space-y-1">
                        {question.similarQuestions.map(sq => (
                          <div key={sq} className="text-xs flex items-center gap-1.5 hover:opacity-80 cursor-pointer" style={{ color: '#7c3aed' }}>
                            <ChevronRight size={12} /> {sq}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* EDITORIAL TAB */}
            {leftTab === 'editorial' && (
              <div className="space-y-5">
                {!solved && !question.editorial?.approach1 ? (
                  <div className="text-center py-12">
                    <Lightbulb size={40} className="mx-auto mb-3" style={{ color: '#f59e0b' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Solve the problem first to unlock the editorial!</p>
                  </div>
                ) : question.editorial?.approach1 ? (
                  <>
                    {[question.editorial.approach1, question.editorial.approach2].filter(Boolean).map((approach, i) => (
                      <div key={i} className="rounded-xl p-4" style={{ border: '1px solid var(--border)' }}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-bold">{i === 0 ? '🐌' : '🚀'} {approach.name}</div>
                          <div className="flex gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                            <span>⏱ {approach.timeComplexity}</span>
                            <span>📦 {approach.spaceComplexity}</span>
                          </div>
                        </div>
                        <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{approach.explanation}</p>
                        {approach.code && (
                          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                            <div className="flex gap-1 px-3 py-1.5" style={{ background: 'var(--bg-primary)' }}>
                              {['cpp', 'java', 'python'].map(l => (
                                <button key={l} onClick={() => {}} className="text-xs px-2 py-0.5 rounded"
                                  style={{ background: lang === l ? '#7c3aed20' : 'transparent', color: lang === l ? '#7c3aed' : 'var(--text-secondary)' }}>
                                  {l === 'cpp' ? 'C++' : l === 'java' ? 'Java' : 'Python'}
                                </button>
                              ))}
                            </div>
                            <pre className="p-3 text-xs overflow-x-auto" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                              <code>{approach.code[lang] || approach.code.cpp || ''}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                    {question.editorial.companyNote && (
                      <div className="rounded-xl p-4" style={{ background: '#7c3aed10', border: '1px solid #7c3aed30' }}>
                        <div className="font-bold mb-2 text-xs" style={{ color: '#7c3aed' }}>💡 Company Note</div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{question.editorial.companyNote}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>Editorial coming soon!</div>
                )}
              </div>
            )}

            {/* SOLUTIONS TAB */}
            {leftTab === 'solutions' && (
              <div className="space-y-4">
                {!solved ? (
                  <div className="rounded-xl p-5 text-center" style={{ background: '#f59e0b10', border: '1px solid #f59e0b30' }}>
                    <p className="text-xs" style={{ color: '#f59e0b' }}>Solve the problem to view community solutions</p>
                  </div>
                ) : (
                  <>
                    {/* Post solution */}
                    {!postSol ? (
                      <button onClick={() => setPostSol(true)} className="btn-primary w-full justify-center text-sm py-2">+ Post Your Solution</button>
                    ) : (
                      <div className="rounded-xl p-4 space-y-3" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                        <input value={postForm.title} onChange={e => setPostForm(p => ({ ...p, title: e.target.value }))}
                          placeholder="Solution title..." className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                          style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                        <textarea value={postForm.explanation} onChange={e => setPostForm(p => ({ ...p, explanation: e.target.value }))}
                          placeholder="Explain your approach..." rows={3} className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                          style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                        <div className="flex gap-2">
                          <button onClick={handlePostSolution} className="btn-primary flex-1 justify-center text-sm py-2">Submit</button>
                          <button onClick={() => setPostSol(false)} className="px-4 py-2 rounded-lg text-sm" style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
                        </div>
                      </div>
                    )}

                    {solutions.length === 0 ? (
                      <p className="text-center py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>No solutions yet. Be the first!</p>
                    ) : solutions.map(sol => (
                      <div key={sol._id} className="rounded-xl p-4 space-y-2" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-sm">{sol.title || `${sol.userName}'s Solution`}</div>
                            <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                              👤 {sol.userName} {sol.college && `— ${sol.college}`}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs px-2 py-0.5 rounded-full font-mono"
                              style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
                              {sol.language === 'cpp' ? 'C++' : sol.language === 'java' ? 'Java' : 'Python'}
                            </span>
                            {sol.runtime && <span className="text-xs" style={{ color: '#22c55e' }}>{sol.runtime}ms</span>}
                          </div>
                        </div>
                        {sol.explanation && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{sol.explanation}</p>}
                        <div className="flex items-center gap-3 pt-1">
                          <button onClick={() => upvoteSolution(sol._id)}
                            className="flex items-center gap-1 text-xs hover:text-purple-500 transition-colors"
                            style={{ color: 'var(--text-secondary)' }}>
                            <ThumbsUp size={12} /> {sol.upvotes}
                          </button>
                          <button onClick={() => setViewCode(sol)} className="text-xs hover:text-purple-500 transition-colors"
                            style={{ color: 'var(--text-secondary)' }}>View Code</button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* SUBMISSIONS TAB */}
            {leftTab === 'submissions' && (
              <div>
                {submissions.length === 0 ? (
                  <div className="text-center py-12">
                    <History size={36} className="mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>No submissions yet</p>
                  </div>
                ) : (
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        {['Status', 'Language', 'Runtime', 'Memory', 'When'].map(h => (
                          <th key={h} className="text-left py-2 px-2 font-medium" style={{ color: 'var(--text-secondary)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map(sub => (
                        <tr key={sub._id} className="hover:opacity-80 cursor-pointer" style={{ borderBottom: '1px solid var(--border)' }}
                          onClick={() => setViewCode({ code: sub.code, language: sub.language, userName: 'My Submission', runtime: sub.runtime })}>
                          <td className="py-2.5 px-2 font-medium" style={{ color: sub.status === 'Accepted' ? '#22c55e' : '#ef4444' }}>
                            {sub.status === 'Accepted' ? '✅' : '❌'} {sub.status}
                          </td>
                          <td className="py-2.5 px-2" style={{ color: 'var(--text-secondary)' }}>
                            {sub.language === 'cpp' ? 'C++' : sub.language === 'java' ? 'Java' : 'Python'}
                          </td>
                          <td className="py-2.5 px-2 font-mono" style={{ color: 'var(--text-secondary)' }}>{sub.runtime ? `${sub.runtime}ms` : '—'}</td>
                          <td className="py-2.5 px-2 font-mono" style={{ color: 'var(--text-secondary)' }}>{sub.memory ? `${sub.memory}KB` : '—'}</td>
                          <td className="py-2.5 px-2" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Editor toolbar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b shrink-0" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            {/* Language selector */}
            <div className="relative">
              <button onClick={() => setShowLangDrop(p => !p)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <span>{langInfo.icon}</span>
                <span>{langInfo.label}</span>
                <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
              </button>
              {showLangDrop && (
                <div className="absolute top-full left-0 mt-1 w-40 rounded-xl shadow-xl z-50 overflow-hidden"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  {LANGS.map(l => (
                    <button key={l.id} onClick={() => handleLangSwitch(l.id)}
                      className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-left hover:bg-purple-500/10 transition-colors"
                      style={{ color: lang === l.id ? '#7c3aed' : 'var(--text-primary)' }}>
                      {l.icon} {l.label} {lang === l.id && '✓'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset code */}
            <button onClick={() => { if (question) { setCode(question.starterCode?.[lang] || getDefaultStarter(lang)); localStorage.removeItem(`placeprep_code_${id}_${lang}`); } }}
              className="p-1.5 rounded-lg hover:opacity-80 transition-opacity" title="Reset to starter code"
              style={{ color: 'var(--text-secondary)' }}>
              <RotateCcw size={15} />
            </button>

            <div className="ml-auto flex items-center gap-2">
              <button onClick={handleRun} disabled={isBusy}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                style={{ background: '#22c55e20', color: '#22c55e', border: '1px solid #22c55e40' }}>
                <Play size={14} fill="#22c55e" />
                {running ? 'Running...' : 'Run'}
              </button>
              {noTestCases ? (
                <button onClick={handleMarkSolved}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: '#fff' }}>
                  <CheckCircle2 size={14} />
                  Mark Solved
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={isBusy}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: '#fff' }}>
                  <Send size={14} />
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            <Editor
              height="100%"
              language={langInfo.monacoLang}
              value={code}
              onChange={(val) => { setCode(val || ''); saveCode(lang, val || ''); }}
              onMount={(editor) => { editorRef.current = editor; timer.start(); }}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                tabSize: 4,
                wordWrap: 'on',
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
                scrollbar: { verticalScrollbarSize: 6 },
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          {/* Drag handle */}
          <div onMouseDown={onDragStart}
            className="flex items-center justify-center h-2 cursor-row-resize shrink-0 select-none hover:bg-purple-500/20 transition-colors"
            style={{ background: 'var(--border)' }}>
            <div className="w-8 h-1 rounded-full" style={{ background: 'var(--text-secondary)', opacity: 0.4 }} />
          </div>

          {/* Bottom Panel */}
          <div className="shrink-0 flex flex-col overflow-hidden" style={{ height: bottomHeight, background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
            {/* Bottom tabs */}
            <div className="flex items-center gap-1 px-3 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
              {[
                { id: 'testcase', label: 'Testcase' },
                { id: 'result', label: 'Test Result' },
                { id: 'console', label: 'Console' },
              ].map(tab => (
                <button key={tab.id} onClick={() => setBottomTab(tab.id)}
                  className="px-3 py-2 text-xs font-medium border-b-2 transition-colors"
                  style={{ borderBottomColor: bottomTab === tab.id ? '#7c3aed' : 'transparent', color: bottomTab === tab.id ? '#7c3aed' : 'var(--text-secondary)' }}>
                  {tab.label}
                </button>
              ))}
              {isBusy && (
                <div className="ml-auto flex items-center gap-2 pr-2 text-xs" style={{ color: '#7c3aed' }}>
                  <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  {running ? 'Running...' : 'Submitting...'}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {/* TESTCASE TAB */}
              {bottomTab === 'testcase' && (
                <div>
                  <div className="flex items-center gap-1 mb-3">
                    {customCases.map((_, i) => (
                      <button key={i} onClick={() => setActiveCase(i)}
                        className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                        style={{ background: activeCase === i ? '#7c3aed20' : 'var(--bg-primary)', color: activeCase === i ? '#7c3aed' : 'var(--text-secondary)', border: `1px solid ${activeCase === i ? '#7c3aed40' : 'var(--border)'}` }}>
                        Case {i + 1}
                      </button>
                    ))}
                    {customCases.length < 5 && (
                      <button onClick={() => { setCustomCases(p => [...p, { input: '', output: '' }]); setActiveCase(customCases.length); }}
                        className="px-2 py-1 rounded-lg text-xs transition-colors"
                        style={{ color: 'var(--text-secondary)', border: '1px dashed var(--border)' }}>+</button>
                    )}
                  </div>
                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Input:</div>
                  <textarea
                    value={customCases[activeCase]?.input || ''}
                    onChange={e => setCustomCases(p => p.map((c, i) => i === activeCase ? { ...c, input: e.target.value } : c))}
                    className="w-full px-3 py-2 rounded-lg text-xs font-mono outline-none resize-none"
                    rows={3}
                    style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    placeholder="Enter test input..." />
                  {customCases[activeCase]?.output && (
                    <div className="mt-2">
                      <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Expected:</div>
                      <div className="px-3 py-2 rounded-lg text-xs font-mono" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: '#22c55e' }}>
                        {customCases[activeCase].output}
                      </div>
                    </div>
                  )}
                  <button onClick={handleRun} disabled={isBusy}
                    className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                    style={{ background: '#22c55e20', color: '#22c55e', border: '1px solid #22c55e40' }}>
                    <Play size={12} fill="#22c55e" /> Run Code
                  </button>
                </div>
              )}

              {/* RESULT TAB */}
              {bottomTab === 'result' && (
                <div>
                  {/* Run result */}
                  {runResult && !submitResult && (
                    <RunResultDisplay result={runResult} />
                  )}
                  {/* Submit result */}
                  {submitResult && (
                    <SubmitResultDisplay result={submitResult} onDebug={(input) => {
                      const newCase = { input, output: submitResult.firstFailed?.expectedOutput || '' };
                      setCustomCases(prev => { const u = [...prev]; u[0] = newCase; return u; });
                      setActiveCase(0);
                      setBottomTab('testcase');
                      setSubmitResult(null);
                    }} />
                  )}
                  {!runResult && !submitResult && (
                    <div className="text-center py-6 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Run or submit your code to see results here
                    </div>
                  )}
                </div>
              )}

              {/* CONSOLE TAB */}
              {bottomTab === 'console' && (
                <div className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {runResult?.stderr ? (
                    <pre className="text-red-400 whitespace-pre-wrap">{runResult.stderr}</pre>
                  ) : (
                    <p>No console output yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccessModal && submitResult?.allPassed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setShowSuccessModal(false)}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md p-8 rounded-2xl text-center relative"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <button onClick={() => setShowSuccessModal(false)} className="absolute top-4 right-4" style={{ color: 'var(--text-secondary)' }}><X size={20} /></button>
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-black mb-2" style={{ color: '#22c55e' }}>Accepted!</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Great job! Your solution passed all test cases.</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {submitResult.runtime && (
                  <div className="rounded-xl p-4" style={{ background: '#22c55e10', border: '1px solid #22c55e30' }}>
                    <div className="text-2xl font-black" style={{ color: '#22c55e' }}>{submitResult.runtime}ms</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Runtime</div>
                    {submitResult.beatsPct && <div className="text-xs mt-1" style={{ color: '#22c55e' }}>Beats {submitResult.beatsPct}%</div>}
                  </div>
                )}
                {submitResult.memory && (
                  <div className="rounded-xl p-4" style={{ background: '#7c3aed10', border: '1px solid #7c3aed30' }}>
                    <div className="text-2xl font-black" style={{ color: '#7c3aed' }}>{submitResult.memory}KB</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Memory</div>
                  </div>
                )}
              </div>
              {submitResult.streak > 1 && (
                <div className="mb-4 py-2 px-4 rounded-full inline-flex items-center gap-2 text-sm font-medium"
                  style={{ background: '#f59e0b15', color: '#f59e0b' }}>
                  🔥 {submitResult.streak} day streak!
                </div>
              )}
              {/* Points earned */}
              <div className="mb-6 py-2 px-4 rounded-full inline-flex items-center gap-2 text-sm font-medium"
                style={{ background: '#7c3aed15', color: '#7c3aed' }}>
                🏆 +{diff === 'Easy' ? 10 : diff === 'Medium' ? 25 : 50} points ({diff})
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setShowSuccessModal(false); setLeftTab('solutions'); }} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>View Solutions</button>
                <button onClick={() => { setShowSuccessModal(false); navigate('/dsa'); }} className="flex-1 py-3 rounded-xl text-sm font-semibold gradient-text" style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: '#fff' }}>Next Question →</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LANG SWITCH MODAL */}
      <AnimatePresence>
        {showLangModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-80 p-6 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Switch Language?</h3>
              <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                Switch to {LANGS.find(l => l.id === showLangModal)?.label}? Your current code will be saved.
              </p>
              <div className="flex gap-3">
                <button onClick={() => applyLangSwitch(showLangModal)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: '#7c3aed', color: '#fff' }}>Switch</button>
                <button onClick={() => setShowLangModal(null)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW CODE MODAL */}
      <AnimatePresence>
        {viewCode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setViewCode(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl overflow-hidden"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{viewCode.userName || 'Solution'}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {viewCode.language === 'cpp' ? 'C++' : viewCode.language === 'java' ? 'Java' : 'Python'}
                    {viewCode.runtime && ` · ${viewCode.runtime}ms`}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { navigator.clipboard.writeText(viewCode.code); toast.success('Copied!'); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    <Copy size={12} /> Copy
                  </button>
                  <button onClick={() => { if (window.confirm('Load to editor?')) { setCode(viewCode.code); setViewCode(null); }}}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: '#7c3aed20', color: '#7c3aed', border: '1px solid #7c3aed30' }}>
                    Load to Editor
                  </button>
                  <button onClick={() => setViewCode(null)}><X size={18} style={{ color: 'var(--text-secondary)' }} /></button>
                </div>
              </div>
              <pre className="p-5 text-xs overflow-auto max-h-96 font-mono" style={{ color: 'var(--text-primary)', background: '#1e1e1e' }}>
                <code>{viewCode.code}</code>
              </pre>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KEYBOARD SHORTCUTS */}
      <button onClick={() => setShowShortcuts(p => !p)}
        className="fixed bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-40 transition-transform hover:scale-110"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
        <Keyboard size={18} />
      </button>
      <AnimatePresence>
        {showShortcuts && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-20 right-6 w-64 p-4 rounded-2xl shadow-2xl z-40"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>⌨️ Shortcuts</div>
            {SHORTCUTS.map(s => (
              <div key={s.key} className="flex items-center justify-between py-1.5 text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>{s.desc}</span>
                <kbd className="px-2 py-0.5 rounded font-mono" style={{ background: 'var(--bg-primary)', color: '#7c3aed', border: '1px solid var(--border)' }}>{s.key}</kbd>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Run Result Display
function RunResultDisplay({ result }) {
  if (result.error) return (
    <div className="rounded-xl p-4" style={{ background: '#ef444410', border: '1px solid #ef444430' }}>
      <div className="flex items-center gap-2 mb-2 font-bold text-sm" style={{ color: '#ef4444' }}><AlertCircle size={16} /> Error</div>
      <pre className="text-xs whitespace-pre-wrap font-mono" style={{ color: '#ef4444' }}>{result.stderr}</pre>
    </div>
  );

  const passed = result.accepted || result.outputMatch;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {passed ? <CheckCircle2 size={18} style={{ color: '#22c55e' }} /> : <XCircle size={18} style={{ color: '#ef4444' }} />}
        <span className="font-bold text-sm" style={{ color: passed ? '#22c55e' : '#ef4444' }}>
          {result.compileError ? '🔴 Compile Error' : result.tle ? '⏱ Time Limit Exceeded' : result.runtimeError ? '💥 Runtime Error' : passed ? '✅ Correct Output' : '❌ Wrong Answer'}
        </span>
        {result.time > 0 && <span className="text-xs ml-auto" style={{ color: 'var(--text-secondary)' }}>{Math.round(result.time * 1000)}ms</span>}
      </div>

      {(result.compileError || result.compileOutput) && (
        <div className="rounded-lg p-3" style={{ background: '#ef444410', border: '1px solid #ef444430' }}>
          <pre className="text-xs font-mono whitespace-pre-wrap" style={{ color: '#ef4444' }}>{result.compileOutput || result.stderr}</pre>
        </div>
      )}

      {!result.compileError && (
        <div className="space-y-2 text-xs">
          <div className="rounded-lg p-3" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
            <div className="font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Input:</div>
            <pre className="font-mono" style={{ color: 'var(--text-primary)' }}>{result.testedInput || result.input || '—'}</pre>
          </div>
          <div className="rounded-lg p-3" style={{ background: 'var(--bg-primary)', border: `1px solid ${passed ? '#22c55e40' : '#ef444440'}` }}>
            <div className="font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Output:</div>
            <pre className="font-mono" style={{ color: passed ? '#22c55e' : '#ef4444' }}>{result.stdout || '(empty)'}</pre>
          </div>
          <div className="rounded-lg p-3" style={{ background: 'var(--bg-primary)', border: '1px solid #22c55e40' }}>
            <div className="font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Expected:</div>
            <pre className="font-mono" style={{ color: '#22c55e' }}>{result.expectedOutput || '—'}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

// Submit Result Display
function SubmitResultDisplay({ result, onDebug }) {
  if (result.errorMessage) return (
    <div className="rounded-xl p-4" style={{ background: '#ef444410', border: '1px solid #ef444430' }}>
      <div className="font-bold text-sm mb-2" style={{ color: '#ef4444' }}>Unable To Evaluate</div>
      <p className="text-xs" style={{ color: '#ef4444' }}>{result.errorMessage}</p>
    </div>
  );

  if (result.compilationError) return (
    <div className="rounded-xl p-4" style={{ background: '#ef444410', border: '1px solid #ef444430' }}>
      <div className="font-bold text-sm mb-2" style={{ color: '#ef4444' }}>🔴 Compilation Error</div>
      <pre className="text-xs font-mono whitespace-pre-wrap" style={{ color: '#ef4444' }}>{result.compilationError}</pre>
    </div>
  );

  if (result.allPassed) return (
    <div className="rounded-xl p-4 text-center" style={{ background: '#22c55e10', border: '1px solid #22c55e40' }}>
      <div className="text-2xl mb-2">🎉</div>
      <div className="font-bold" style={{ color: '#22c55e' }}>All {result.totalCount} test cases passed!</div>
      {result.runtime > 0 && <div className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>Runtime: {result.runtime}ms · Memory: {result.memory}KB</div>}
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <XCircle size={18} style={{ color: '#ef4444' }} />
        <span className="font-bold text-sm" style={{ color: '#ef4444' }}>
          {result.firstFailed?.tle ? '⏱ Time Limit Exceeded' : result.firstFailed?.runtimeError ? '💥 Runtime Error' : '❌ Wrong Answer'}
        </span>
        <span className="text-xs ml-auto" style={{ color: 'var(--text-secondary)' }}>{result.passedCount}/{result.totalCount} passed</span>
      </div>
      {result.firstFailed && (
        <div className="space-y-2 text-xs">
          <div className="rounded-lg p-3" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
            <div className="font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Failed Input:</div>
            <pre className="font-mono" style={{ color: 'var(--text-primary)' }}>{result.firstFailed.input}</pre>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg p-3" style={{ background: '#ef444410', border: '1px solid #ef444440' }}>
              <div className="font-medium mb-1" style={{ color: '#ef4444' }}>Your Output:</div>
              <pre className="font-mono" style={{ color: '#ef4444' }}>{result.firstFailed.actualOutput || '(empty)'}</pre>
            </div>
            <div className="rounded-lg p-3" style={{ background: '#22c55e10', border: '1px solid #22c55e40' }}>
              <div className="font-medium mb-1" style={{ color: '#22c55e' }}>Expected:</div>
              <pre className="font-mono" style={{ color: '#22c55e' }}>{result.firstFailed.expectedOutput}</pre>
            </div>
          </div>
          <button onClick={() => onDebug(result.firstFailed.input)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
            style={{ background: '#7c3aed15', color: '#7c3aed', border: '1px solid #7c3aed30' }}>
            🐛 Debug This Case
          </button>
        </div>
      )}
    </div>
  );
}
