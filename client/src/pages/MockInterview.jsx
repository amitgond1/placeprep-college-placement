import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mic, MicOff, Send, RotateCcw, Trophy, ChevronRight, Square, Play } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const COMPANIES = ['Amazon','Google','Microsoft','TCS','Wipro','Infosys','Cognizant','Capgemini','Flipkart','Accenture','Meta','Zoho','HCL','Tech Mahindra'];
const ROUNDS = ['Technical Round','HR Round','DSA Round','System Design','Aptitude Round','Managerial Round'];
const DIFFICULTIES = ['Easy','Medium','Hard'];

const companyNotes = {
  TCS: 'Includes Aptitude round before technical',
  Wipro: 'Aptitude + Essay before coding round',
  Infosys: 'InfyTQ assessment + technical rounds',
  Cognizant: 'GenC/GenC Pro/GenC Elevate based on role',
  Capgemini: 'Game-based assessment + technical',
  Accenture: 'Cognitive assessment + written test',
};

export default function MockInterview() {
  const [phase, setPhase] = useState('setup'); // setup | interview | results
  const [config, setConfig] = useState({ company: 'Amazon', roundType: 'Technical Round', difficulty: 'Medium', mode: 'text' });
  const [session, setSession] = useState(null);
  const [currentQ, setCurrentQ] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [report, setReport] = useState(null);
  const [qHistory, setQHistory] = useState([]);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  const startInterview = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/mock/start', config);
      setSession({ id: data.sessionId });
      setCurrentQ(data.question);
      setQHistory([{ question: data.question }]);
      setQIndex(0);
      setPhase('interview');
    } catch { toast.error('Failed to start interview. Check API key configuration.'); }
    finally { setLoading(false); }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) { toast.error('Please provide an answer'); return; }
    setLoading(true);
    try {
      const { data } = await api.post(`/mock/answer/${session.id}`, { answer, questionIndex: qIndex });
      setEvaluation(data.evaluation);
      const updated = [...qHistory];
      updated[qIndex] = { ...updated[qIndex], userAnswer: answer, ...data.evaluation };
      if (data.nextQuestion) updated.push({ question: data.nextQuestion });
      setQHistory(updated);
      if (data.isComplete) {
        await completeSession(updated);
      }
    } catch { toast.error('Failed to evaluate answer'); }
    finally { setLoading(false); }
  };

  const nextQuestion = () => {
    if (qIndex >= 9) return;
    setAnswer('');
    setEvaluation(null);
    setQIndex(i => i + 1);
    setCurrentQ(qHistory[qIndex + 1]?.question);
  };

  const completeSession = async (history) => {
    try {
      const { data } = await api.post(`/mock/complete/${session.id}`, { duration: 0 });
      setReport(data.report);
      setPhase('results');
    } catch { toast.error('Failed to generate report'); }
  };

  const handleEndEarly = async () => {
    if (qHistory.filter(q => q.score !== undefined).length === 0) {
      toast.error('Answer at least one question before ending');
      return;
    }
    await completeSession(qHistory);
  };

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRef.current.ondataavailable = e => chunksRef.current.push(e.data);
      mediaRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const fd = new FormData();
        fd.append('audio', blob, 'recording.webm');
        try {
          const { data } = await api.post('/mock/transcribe', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
          setAnswer(data.transcript);
          toast.success('Transcribed!');
        } catch { toast.error('Transcription failed'); }
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRef.current.start();
      setRecording(true);
    } catch { toast.error('Microphone access denied'); }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  const reset = () => {
    setPhase('setup'); setSession(null); setCurrentQ(null);
    setQIndex(0); setAnswer(''); setEvaluation(null); setReport(null); setQHistory([]);
  };

  const scoreColor = (s) => s >= 8 ? '#22c55e' : s >= 5 ? '#f59e0b' : '#ef4444';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>AI Mock Interview</h1>
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-1">Practice with company-specific questions powered by Claude AI</p>
      </div>

      {/* SETUP */}
      <AnimatePresence mode="wait">
        {phase === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="card space-y-6">
              <h2 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Configure your interview</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Company</label>
                  <select value={config.company} onChange={e => setConfig(p => ({ ...p, company: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    {COMPANIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  {companyNotes[config.company] && (
                    <p className="text-xs mt-1.5 px-1" style={{ color: '#f59e0b' }}>ℹ️ {companyNotes[config.company]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Round Type</label>
                  <select value={config.roundType} onChange={e => setConfig(p => ({ ...p, roundType: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    {ROUNDS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Difficulty</label>
                  <div className="flex gap-2">
                    {DIFFICULTIES.map(d => (
                      <button key={d} onClick={() => setConfig(p => ({ ...p, difficulty: d }))}
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all"
                        style={config.difficulty === d
                          ? { background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: 'white', borderColor: 'transparent' }
                          : { borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Mode</label>
                  <div className="flex gap-2">
                    {[{ v: 'text', label: '✍️ Text' }, { v: 'voice', label: '🎙️ Voice' }].map(m => (
                      <button key={m.v} onClick={() => setConfig(p => ({ ...p, mode: m.v }))}
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all"
                        style={config.mode === m.v
                          ? { background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: 'white', borderColor: 'transparent' }
                          : { borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="p-4 rounded-xl" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
                <div className="text-sm font-semibold mb-2" style={{ color: '#7c3aed' }}>What to expect</div>
                <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <div>• 5–10 questions from {config.company}'s {config.roundType}</div>
                  <div>• Real-time AI evaluation with scores and feedback</div>
                  <div>• Final report with strengths and improvement areas</div>
                </div>
              </div>

              <button onClick={startInterview} disabled={loading} className="btn-primary w-full justify-center py-3">
                {loading ? 'Starting...' : `Start ${config.company} ${config.roundType} →`}
              </button>
            </div>
          </motion.div>
        )}

        {/* INTERVIEW */}
        {phase === 'interview' && currentQ && (
          <motion.div key="interview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-4">
            {/* Progress */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>{config.company}</span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{config.roundType} · {config.difficulty}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Q{qIndex + 1}/10</span>
                <button onClick={handleEndEarly} className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:border-red-400 hover:text-red-500"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                  End Interview
                </button>
              </div>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${(qIndex / 10) * 100}%`, background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }} />
            </div>

            {/* Question */}
            <div className="card">
              <div className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: '#7c3aed' }}>Question {qIndex + 1}</div>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>{currentQ}</p>
            </div>

            {/* Answer */}
            {!evaluation && (
              <div className="card space-y-4">
                <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Your Answer:</div>
                {config.mode === 'text' ? (
                  <textarea value={answer} onChange={e => setAnswer(e.target.value)}
                    rows={6} placeholder="Type your answer here..."
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-purple-500 resize-none"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                ) : (
                  <div className="space-y-3">
                    <textarea value={answer} onChange={e => setAnswer(e.target.value)}
                      rows={4} placeholder="Your transcribed answer will appear here..."
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                      style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    <div className="flex items-center gap-4">
                      <button onClick={recording ? stopRecording : startRecording}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${recording ? 'bg-red-500 text-white' : ''}`}
                        style={!recording ? { background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: 'white' } : {}}>
                        {recording ? <><Square size={14} /> Stop</> : <><Mic size={14} /> Record</>}
                      </button>
                      {recording && (
                        <div className="flex items-end gap-1 h-6">
                          {[1,2,3,4,5].map(i => <div key={i} className="waveform-bar" style={{ animationDelay: `${i*0.1}s` }} />)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <button onClick={submitAnswer} disabled={loading || !answer.trim()}
                  className="btn-primary w-full justify-center disabled:opacity-50">
                  {loading ? 'Evaluating...' : <><Send size={15} /> Submit Answer</>}
                </button>
              </div>
            )}

            {/* Evaluation */}
            {evaluation && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Evaluation</span>
                  <span className="text-2xl font-bold" style={{ color: scoreColor(evaluation.score) }}>
                    {evaluation.score}/10
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{evaluation.feedback}</p>
                {evaluation.idealAnswer && (
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
                    <div className="text-xs font-semibold mb-1" style={{ color: '#06b6d4' }}>Ideal Answer</div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{evaluation.idealAnswer}</p>
                  </div>
                )}
                {evaluation.strengths?.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold mb-1.5 text-green-500">Strengths</div>
                    {evaluation.strengths.map((s, i) => <div key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>✅ {s}</div>)}
                  </div>
                )}
                {evaluation.improvements?.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold mb-1.5 text-orange-500">Improvements</div>
                    {evaluation.improvements.map((s, i) => <div key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>⚡ {s}</div>)}
                  </div>
                )}
                <button onClick={nextQuestion} disabled={qIndex >= 9}
                  className="btn-primary w-full justify-center disabled:opacity-50">
                  {qIndex >= 9 ? 'Completing...' : <>Next Question <ChevronRight size={15} /></>}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* RESULTS */}
        {phase === 'results' && report && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {/* Score Card */}
            <div className="card text-center">
              <Trophy size={40} className="mx-auto mb-3" style={{ color: '#f59e0b' }} />
              <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Interview Complete!</h2>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-4">{config.company} · {config.roundType}</p>
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full text-4xl font-black text-white mb-4"
                style={{ background: `conic-gradient(${report.overallScore >= 70 ? '#22c55e' : report.overallScore >= 50 ? '#f59e0b' : '#ef4444'} ${report.overallScore * 3.6}deg, var(--border) 0deg)` }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--bg-card)', color: report.overallScore >= 70 ? '#22c55e' : report.overallScore >= 50 ? '#f59e0b' : '#ef4444' }}>
                  {report.overallScore}
                </div>
              </div>
              <p className="text-sm font-medium" style={{ color: report.overallScore >= 70 ? '#22c55e' : report.overallScore >= 50 ? '#f59e0b' : '#ef4444' }}>
                {report.overallScore >= 70 ? 'Excellent Performance!' : report.overallScore >= 50 ? 'Good — Keep Practicing!' : 'Needs Improvement'}
              </p>
              {report.overallFeedback && <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>{report.overallFeedback}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="card">
                <div className="font-semibold mb-3 text-green-500">Strengths</div>
                <div className="space-y-2">
                  {report.strengths?.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <span className="text-green-500 mt-0.5">✅</span> {s}
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="font-semibold mb-3 text-orange-500">Areas to Improve</div>
                <div className="space-y-2">
                  {report.improvements?.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <span className="text-orange-500 mt-0.5">⚡</span> {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {report.recommendedTopics?.length > 0 && (
              <div className="card">
                <div className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Recommended Study Topics</div>
                <div className="flex flex-wrap gap-2">
                  {report.recommendedTopics.map((t, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{ background: 'rgba(124,58,237,0.12)', color: '#7c3aed' }}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={reset} className="flex-1 btn-primary justify-center">
                <RotateCcw size={15} /> New Interview
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
