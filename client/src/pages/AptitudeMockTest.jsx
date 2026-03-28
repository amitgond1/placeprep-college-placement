import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Flag, ChevronLeft, ChevronRight, Clock, Send, Grid3X3, X } from 'lucide-react';
import api from '../services/api';

export default function AptitudeMockTest() {
  const { mockId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [questionTimes, setQuestionTimes] = useState({});
  const [qStartTime, setQStartTime] = useState(Date.now());
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    fetchQuestions();
    return () => clearInterval(timerRef.current);
  }, [mockId]);

  const fetchQuestions = async () => {
    try {
      const { data } = await api.get(`/aptitude/mock/${mockId}/questions`);
      setQuestions(data.questions);
      const d = mockId.includes('tcs') || mockId.includes('wipro') || mockId.includes('infosys') ? 40 : 30;
      setDuration(d);
      setTimeLeft(d * 60);
      startTimeRef.current = Date.now();
      setQStartTime(Date.now());
    } catch { toast.error('Failed to load questions'); navigate('/aptitude'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!loading && questions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [loading, questions]);

  const handleAnswer = (qId, opt) => {
    const elapsed = Math.round((Date.now() - qStartTime) / 1000);
    setQuestionTimes(p => ({ ...p, [qId]: elapsed }));
    setAnswers(p => ({ ...p, [qId]: opt }));
  };

  const handleNav = (idx) => {
    const elapsed = Math.round((Date.now() - qStartTime) / 1000);
    if (questions[current]) {
      setQuestionTimes(p => ({ ...p, [questions[current]._id]: (p[questions[current]._id] || 0) + elapsed }));
    }
    setCurrent(idx);
    setQStartTime(Date.now());
    setShowPalette(false);
  };

  const toggleFlag = () => {
    setFlagged(prev => {
      const n = new Set(prev);
      const id = questions[current]?._id;
      if (id) { n.has(id) ? n.delete(id) : n.add(id); }
      return n;
    });
  };

  const handleSubmit = useCallback(async (auto = false) => {
    clearInterval(timerRef.current);
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    try {
      const finalQuestionTimes = { ...questionTimes };
      const currentQuestionId = questions[current]?._id;
      if (currentQuestionId) {
        const elapsed = Math.round((Date.now() - qStartTime) / 1000);
        finalQuestionTimes[currentQuestionId] = (finalQuestionTimes[currentQuestionId] || 0) + elapsed;
      }

      const { data } = await api.post(`/aptitude/mock/${mockId}/submit`, {
        answers, timeTaken, negativeMarking, questionTimes: finalQuestionTimes
      });
      if (!data?.resultId) {
        throw new Error('Submission response is incomplete. Please retry.');
      }
      toast.success(`Score: ${data.score}/25`);
      navigate(`/aptitude/results/${data.resultId}`);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Submission failed';
      toast.error(message);
      setSubmitting(false);
    }
  }, [answers, current, mockId, navigate, negativeMarking, qStartTime, questionTimes, questions]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const getBoxStyle = (q, i) => {
    const isAnswered = !!answers[q._id];
    const isFlagged = flagged.has(q._id);
    const isCurrent = i === current;
    if (isCurrent) return { background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: 'white' };
    if (isFlagged && isAnswered) return { background: '#f59e0b', color: 'white' };
    if (isFlagged) return { background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: '1px solid #f59e0b' };
    if (isAnswered) return { background: '#22c55e', color: 'white' };
    return { background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' };
  };

  const answered = Object.keys(answers).length;
  const q = questions[current];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p style={{ color: 'var(--text-secondary)' }}>Loading questions...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-4" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-sm"
        style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            {mockId.replace(/_/g, ' ').toUpperCase()}
          </span>
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
            {answered}/{questions.length} answered
          </span>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-lg ${timeLeft <= 60 ? 'animate-pulse' : ''}`}
          style={{ background: timeLeft <= 60 ? 'rgba(239,68,68,0.15)' : 'rgba(6,182,212,0.1)', color: timeLeft <= 60 ? '#ef4444' : '#06b6d4' }}>
          <Clock size={16} /> {formatTime(timeLeft)}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowPalette(p => !p)}
            className="p-2 rounded-xl transition-colors"
            style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
            <Grid3X3 size={16} />
          </button>
          <button onClick={() => setShowConfirm(true)}
            className="btn-primary py-2 px-4 text-sm">
            <Send size={14} /> Submit
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-4 flex gap-4">
        {/* Main */}
        <div className="flex-1 space-y-4">
          {/* Negative marking toggle */}
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <button onClick={() => setNegativeMarking(p => !p)}
              className={`w-10 h-5 rounded-full transition-all relative ${negativeMarking ? 'bg-red-500' : ''}`}
              style={!negativeMarking ? { background: 'var(--border)' } : {}}>
              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${negativeMarking ? 'right-0.5' : 'left-0.5'}`} />
            </button>
            Negative Marking {negativeMarking ? '(-0.25 per wrong)' : '(Off)'}
          </div>

          {/* Question */}
          {q && (
            <AnimatePresence mode="wait">
              <motion.div key={current}
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="card space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#7c3aed' }}>
                    Question {current + 1} of {questions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    {flagged.has(q._id) && <span className="text-xs text-orange-500 font-medium">🚩 Flagged</span>}
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      q.difficulty === 'Easy' ? 'badge-easy' : q.difficulty === 'Hard' ? 'badge-hard' : 'badge-medium'
                    }`}>{q.difficulty}</span>
                  </div>
                </div>

                <p className="text-base leading-relaxed font-medium" style={{ color: 'var(--text-primary)' }}>
                  {q.questionText}
                </p>

                <div className="space-y-2.5">
                  {['A','B','C','D'].map((opt, i) => (
                    <button key={opt} onClick={() => handleAnswer(q._id, opt)}
                      className="w-full flex items-start gap-3 p-4 rounded-xl border text-left text-sm transition-all hover:border-purple-400"
                      style={{
                        borderColor: answers[q._id] === opt ? '#7c3aed' : 'var(--border)',
                        background: answers[q._id] === opt ? 'rgba(124,58,237,0.1)' : 'var(--bg-primary)',
                        color: 'var(--text-primary)'
                      }}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        answers[q._id] === opt ? 'text-white' : ''
                      }`} style={answers[q._id] === opt
                        ? { background: '#7c3aed' }
                        : { background: 'var(--border)', color: 'var(--text-secondary)' }}>
                        {opt}
                      </span>
                      {q.options?.[i]}
                    </button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-2">
                  <button onClick={() => handleNav(current - 1)} disabled={current === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all disabled:opacity-30"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    <ChevronLeft size={15} /> Previous
                  </button>
                  <button onClick={toggleFlag}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
                    style={flagged.has(q._id)
                      ? { background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid #f59e0b' }
                      : { border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    <Flag size={14} /> {flagged.has(q._id) ? 'Unflag' : 'Flag'}
                  </button>
                  <button onClick={() => handleNav(current + 1)} disabled={current === questions.length - 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all disabled:opacity-30"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    Next <ChevronRight size={15} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Question Palette — desktop sidebar */}
        <div className="hidden lg:block w-52 shrink-0">
          <div className="card sticky top-20">
            <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>QUESTION PALETTE</div>
            <div className="grid grid-cols-5 gap-1.5 mb-4">
              {questions.map((q, i) => (
                <button key={i} onClick={() => handleNav(i)}
                  className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                  style={getBoxStyle(q, i)}>
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="space-y-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-500" /> Answered</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-orange-400" /> Flagged</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded" style={{ background: 'var(--border)' }} /> Unattempted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Palette */}
      <AnimatePresence>
        {showPalette && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end lg:hidden"
            onClick={() => setShowPalette(false)}>
            <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }}
              className="w-full p-6 rounded-t-2xl" style={{ background: 'var(--bg-card)' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Question Palette</span>
                <button onClick={() => setShowPalette(false)}><X size={20} style={{ color: 'var(--text-secondary)' }} /></button>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {questions.map((q, i) => (
                  <button key={i} onClick={() => handleNav(i)}
                    className="w-9 h-9 rounded-lg text-xs font-bold"
                    style={getBoxStyle(q, i)}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Submit Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-full max-w-sm p-6 rounded-2xl space-y-4" style={{ background: 'var(--bg-card)' }}>
              <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Submit Test?</h3>
              <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <div>Answered: <strong style={{ color: '#22c55e' }}>{answered}</strong> / {questions.length}</div>
                <div>Unanswered: <strong style={{ color: '#ef4444' }}>{questions.length - answered}</strong></div>
                <div>Flagged: <strong style={{ color: '#f59e0b' }}>{flagged.size}</strong></div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
                <button onClick={() => handleSubmit()} disabled={submitting}
                  className="flex-1 btn-primary justify-center py-2.5 disabled:opacity-70 text-sm">
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
