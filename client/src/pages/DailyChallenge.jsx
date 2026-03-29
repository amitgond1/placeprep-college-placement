import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, CheckCircle2, Circle, ChevronRight, Calendar, Trophy, Zap, BookOpen, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const DAILY_QUOTES = [
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It's going to be hard, but hard is not impossible.",
  "Don't wait for opportunity. Create it.",
  "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
  "The key to success is to focus on goals, not obstacles.",
  "Dream bigger. Do bigger.",
];

function getDailyQuote() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
}

function DifficultyBadge({ difficulty }) {
  const colors = {
    Easy: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' },
    Medium: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' },
    Hard: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
  };
  const style = colors[difficulty] || colors.Medium;
  return (
    <span style={{ ...style, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      {difficulty}
    </span>
  );
}

function StreakCalendar({ history }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
      {history.map((day, idx) => (
        <motion.div
          key={day.date}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.02 }}
          title={`${day.date}: ${day.completed ? 'Completed' : day.completedDsa || day.completedAptitude ? 'Partial' : 'Missed'}`}
          style={{
            width: 22,
            height: 22,
            borderRadius: 4,
            backgroundColor: day.completed
              ? '#7c3aed'
              : day.completedDsa || day.completedAptitude
              ? 'rgba(124,58,237,0.4)'
              : 'var(--border)',
            cursor: 'pointer',
            border: day.date === new Date().toISOString().split('T')[0] ? '2px solid #06b6d4' : '2px solid transparent'
          }}
        />
      ))}
    </div>
  );
}

export default function DailyChallenge() {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [completing, setCompleting] = useState({ dsa: false, aptitude: false });

  const quote = getDailyQuote();

  async function fetchChallenge() {
    setLoading(true);
    try {
      const [cRes, hRes] = await Promise.all([
        api.get('/daily/challenge'),
        api.get('/daily/history')
      ]);
      setChallenge(cRes.data);
      setHistory(hRes.data.history || []);
      setStreak(hRes.data.streak || 0);
    } catch (err) {
      toast.error('Failed to load daily challenge');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchChallenge(); }, []);

  async function handleDsaComplete() {
    if (challenge?.completion?.completedDsa) return;
    setCompleting(p => ({ ...p, dsa: true }));
    try {
      const { data } = await api.post('/daily/complete', { type: 'dsa' });
      toast.success(data.bonusAwarded ? '🎉 +5 bonus points! DSA challenge done!' : 'DSA already completed');
      setChallenge(prev => ({ ...prev, completion: data.completion }));
    } catch {
      toast.error('Could not mark DSA complete');
    } finally {
      setCompleting(p => ({ ...p, dsa: false }));
    }
  }

  async function handleRevealAnswer() {
    if (selectedOption === null) {
      toast.error('Please select an option first');
      return;
    }
    try {
      const { data } = await api.post('/daily/reveal-answer');
      setCorrectAnswer(data.correctAnswer);
      setExplanation(data.explanation);
      setRevealed(true);
      // Mark aptitude complete
      if (!challenge?.completion?.completedAptitude) {
        const res = await api.post('/daily/complete', { type: 'aptitude' });
        if (res.data.bonusAwarded) toast.success('🎉 +5 bonus points! Aptitude challenge done!');
        setChallenge(prev => ({ ...prev, completion: res.data.completion }));
        // refresh history
        const hRes = await api.get('/daily/history');
        setHistory(hRes.data.history || []);
        setStreak(hRes.data.streak || 0);
      }
    } catch {
      toast.error('Could not reveal answer');
    }
  }

  const optionLabels = ['A', 'B', 'C', 'D'];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const completedCount = (challenge?.completion?.completedDsa ? 1 : 0) + (challenge?.completion?.completedAptitude ? 1 : 0);

  return (
    <div style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', borderRadius: 12, padding: 10 }}>
            <Flame size={24} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Daily Challenge</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 14 }}>
              {challenge?.date} &nbsp;·&nbsp; Day <strong style={{ color: '#7c3aed' }}>{challenge?.dayOfJourney}</strong> of your journey
            </p>
          </div>
          <button
            onClick={fetchChallenge}
            style={{ marginLeft: 'auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </motion.div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.10))', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 12, padding: '12px 16px', margin: '16px 0', fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: 14 }}
      >
        "{quote}"
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
        style={{ marginBottom: 24, padding: '16px 20px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Today's Progress</span>
          <span style={{ color: completedCount === 2 ? '#10b981' : 'var(--text-secondary)', fontWeight: 700 }}>
            {completedCount}/2 completed
          </span>
        </div>
        <div style={{ background: 'var(--border)', borderRadius: 8, height: 10, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / 2) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', borderRadius: 8 }}
          />
        </div>
        {completedCount === 2 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#10b981', marginTop: 8, fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
            🎉 Both challenges completed today! Great work!
          </motion.p>
        )}
      </motion.div>

      {/* Challenge Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 28 }}>
        {/* DSA Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="card"
          style={{ border: challenge?.completion?.completedDsa ? '1px solid rgba(16,185,129,0.4)' : '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}
        >
          {challenge?.completion?.completedDsa && (
            <div style={{ position: 'absolute', top: 12, right: 12 }}>
              <CheckCircle2 size={22} color="#10b981" />
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ background: 'rgba(124,58,237,0.15)', borderRadius: 8, padding: 8 }}>
              <BookOpen size={18} color="#7c3aed" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>DSA Challenge</span>
          </div>
          {challenge?.dsaQuestion ? (
            <>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                {challenge.dsaQuestion.title}
              </h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                <DifficultyBadge difficulty={challenge.dsaQuestion.difficulty} />
                <span style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 20, padding: '2px 10px', fontSize: 12, color: 'var(--text-secondary)' }}>
                  {challenge.dsaQuestion.topic}
                </span>
              </div>
              {challenge.dsaQuestion.companies?.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {challenge.dsaQuestion.companies.slice(0, 3).map(c => (
                    <span key={c} style={{ background: 'rgba(6,182,212,0.12)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 20, padding: '2px 8px', fontSize: 11 }}>{c}</span>
                  ))}
                </div>
              )}
              {challenge.dsaQuestion.description && (
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 14, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {challenge.dsaQuestion.description}
                </p>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => { handleDsaComplete(); navigate(`/compiler/${challenge.dsaQuestion._id}`); }}
                  style={{ flex: 1, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', border: 'none', borderRadius: 10, padding: '10px 0', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  Solve Now <ChevronRight size={16} />
                </button>
                {!challenge?.completion?.completedDsa && (
                  <button
                    onClick={handleDsaComplete}
                    disabled={completing.dsa}
                    style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }}
                  >
                    {completing.dsa ? '...' : 'Mark Done'}
                  </button>
                )}
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No DSA question available today</p>
          )}
        </motion.div>

        {/* Aptitude Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
          style={{ border: challenge?.completion?.completedAptitude ? '1px solid rgba(16,185,129,0.4)' : '1px solid var(--border)' }}
        >
          {challenge?.completion?.completedAptitude && (
            <div style={{ position: 'absolute', top: 12, right: 12 }}>
              <CheckCircle2 size={22} color="#10b981" />
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ background: 'rgba(6,182,212,0.15)', borderRadius: 8, padding: 8 }}>
              <Zap size={18} color="#06b6d4" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>Aptitude Challenge</span>
          </div>
          {challenge?.aptitudeQuestion ? (
            <>
              <p style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 500, marginBottom: 10, lineHeight: 1.6 }}>
                {challenge.aptitudeQuestion.questionText}
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <DifficultyBadge difficulty={challenge.aptitudeQuestion.difficulty} />
                <span style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 20, padding: '2px 10px', fontSize: 12, color: 'var(--text-secondary)' }}>
                  {challenge.aptitudeQuestion.topic}
                </span>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                {challenge.aptitudeQuestion.options?.map((opt, idx) => {
                  const label = optionLabels[idx];
                  const isSelected = selectedOption === label;
                  const isCorrect = revealed && label === correctAnswer;
                  const isWrong = revealed && isSelected && label !== correctAnswer;
                  return (
                    <button
                      key={idx}
                      onClick={() => !revealed && setSelectedOption(label)}
                      style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: isCorrect
                          ? '1px solid #10b981'
                          : isWrong
                          ? '1px solid #ef4444'
                          : isSelected
                          ? '1px solid #7c3aed'
                          : '1px solid var(--border)',
                        background: isCorrect
                          ? 'rgba(16,185,129,0.12)'
                          : isWrong
                          ? 'rgba(239,68,68,0.12)'
                          : isSelected
                          ? 'rgba(124,58,237,0.12)'
                          : 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        cursor: revealed ? 'default' : 'pointer',
                        fontSize: 14,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 12,
                        background: isCorrect ? '#10b981' : isWrong ? '#ef4444' : isSelected ? '#7c3aed' : 'var(--border)',
                        color: isCorrect || isWrong || isSelected ? 'white' : 'var(--text-secondary)',
                        flexShrink: 0
                      }}>{label}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {!revealed ? (
                <button
                  onClick={handleRevealAnswer}
                  disabled={selectedOption === null}
                  style={{
                    width: '100%',
                    background: selectedOption === null ? 'var(--border)' : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px 0',
                    color: selectedOption === null ? 'var(--text-secondary)' : 'white',
                    fontWeight: 600,
                    cursor: selectedOption === null ? 'not-allowed' : 'pointer',
                    fontSize: 14
                  }}
                >
                  Submit Answer
                </button>
              ) : (
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, padding: 12 }}>
                  <p style={{ fontWeight: 600, color: selectedOption === correctAnswer ? '#10b981' : '#ef4444', marginBottom: 4, fontSize: 14 }}>
                    {selectedOption === correctAnswer ? '✓ Correct!' : `✗ Correct answer: ${correctAnswer}`}
                  </p>
                  {explanation && <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{explanation}</p>}
                </div>
              )}
            </>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No aptitude question available today</p>
          )}
        </motion.div>
      </div>

      {/* Streak & Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
        style={{ marginBottom: 24 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calendar size={20} color="#7c3aed" />
            <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>30-Day Streak Calendar</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(124,58,237,0.12)', borderRadius: 20, padding: '4px 14px' }}>
            <Flame size={16} color="#f59e0b" />
            <span style={{ fontWeight: 700, color: '#f59e0b' }}>{streak} day streak</span>
          </div>
        </div>
        <StreakCalendar history={history} />
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          {[
            { color: '#7c3aed', label: 'Completed' },
            { color: 'rgba(124,58,237,0.4)', label: 'Partial' },
            { color: 'var(--border)', label: 'Missed' }
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Trophy size={20} color="#f59e0b" />
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>Challenge History</span>
        </div>
        {history.filter(d => d.completedDsa || d.completedAptitude).length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px 0' }}>No completions yet. Start your streak today!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history
              .filter(d => d.completedDsa || d.completedAptitude)
              .reverse()
              .slice(0, 10)
              .map((day, idx) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-primary)', borderRadius: 10, border: '1px solid var(--border)' }}
                >
                  <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{day.date}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: day.completedDsa ? '#10b981' : 'var(--text-secondary)' }}>
                      {day.completedDsa ? <CheckCircle2 size={14} /> : <Circle size={14} />} DSA
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: day.completedAptitude ? '#10b981' : 'var(--text-secondary)' }}>
                      {day.completedAptitude ? <CheckCircle2 size={14} /> : <Circle size={14} />} Aptitude
                    </span>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
