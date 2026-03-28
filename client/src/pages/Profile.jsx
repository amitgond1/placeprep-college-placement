import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Edit3, Save, Camera, GitBranch, Link, Code2, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [leetcodeLoading, setLeetcodeLoading] = useState(false);
  const fileRef = useRef();

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/user/profile');
      setProfileData(data);
      setForm({
        name: data.user.name || '',
        college: data.user.college || '',
        branch: data.user.branch || '',
        linkedinUrl: data.user.linkedinUrl || '',
        githubUrl: data.user.githubUrl || '',
        leetcodeUsername: data.user.leetcodeUsername || '',
        targetPackage: data.user.targetPackage || 0,
        dailyGoal: data.user.dailyGoal || 3,
        emailReminders: data.user.emailReminders !== false,
        weeklyReport: data.user.weeklyReport !== false,
      });
    } catch { toast.error('Failed to load profile'); }
    finally { setLoading(false); }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch('/user/profile', form);
      updateUser(data.user);
      setEditing(false);
      toast.success('Profile updated!');
      fetchProfile();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      const { data } = await api.post('/user/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser({ avatar: data.avatar });
      toast.success('Avatar updated!');
    } catch { toast.error('Avatar upload failed'); }
  };

  const syncLeetCode = async () => {
    if (!form.leetcodeUsername) { toast.error('Enter your LeetCode username first'); return; }
    setLeetcodeLoading(true);
    try {
      const { data } = await api.get(`/user/leetcode/${form.leetcodeUsername}`);
      updateUser({ leetcodeSolved: data.solved });
      toast.success(`Synced! ${data.solved} problems solved`);
    } catch { toast.error('Failed to sync LeetCode'); }
    finally { setLeetcodeLoading(false); }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  if (loading) return (
    <div className="max-w-4xl mx-auto space-y-4">
      {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}
    </div>
  );

  const mocks = profileData?.mocks || [];
  const aptStats = profileData?.aptStats || {};

  const mockChartData = mocks.map((m, i) => ({
    label: `${m.company} ${i + 1}`,
    score: m.overallScore,
    date: new Date(m.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  })).reverse();

  const radarData = [
    { topic: 'Quant', value: 60 },
    { topic: 'LR', value: 70 },
    { topic: 'Verbal', value: 75 },
    { topic: 'DI', value: 55 },
    { topic: 'Series', value: 80 },
    { topic: 'Prob.', value: 50 },
  ];

  const avgApt = aptStats.average || 0;
  const tcsReady = avgApt >= 65;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>My Profile</h1>
        {editing ? (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-xl border text-sm"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
            <button onClick={saveProfile} disabled={saving} className="btn-primary disabled:opacity-70">
              <Save size={14} /> {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="btn-primary">
            <Edit3 size={14} /> Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden" style={{ border: '3px solid rgba(124,58,237,0.5)' }}>
              {user?.avatar
                ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>{initials}</div>
              }
            </div>
            {editing && (
              <button onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
                <Camera size={14} />
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            {editing ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: 'Name', key: 'name' }, { label: 'College', key: 'college' },
                  { label: 'Branch', key: 'branch' }, { label: 'Daily Goal', key: 'dailyGoal', type: 'number' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{f.label}</label>
                    <input type={f.type || 'text'} value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border text-sm outline-none focus:border-purple-500"
                      style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{user?.name}</h2>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {user?.branch || 'Branch'} · {user?.college || 'College'} · {user?.graduationYear}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user?.targetCompanies?.slice(0, 5).map(c => (
                    <span key={c} className="text-xs px-2 py-1 rounded-full"
                      style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>{c}</span>
                  ))}
                  {user?.targetCompanies?.length > 5 && (
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                      +{user.targetCompanies.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Social Links */}
            <div className="space-y-2">
              {editing ? (
                <>
                  {[
                    { key: 'linkedinUrl', placeholder: 'LinkedIn URL', icon: Link },
                    { key: 'githubUrl', placeholder: 'GitHub URL', icon: GitBranch },
                    { key: 'leetcodeUsername', placeholder: 'LeetCode Username', icon: Code2 },
                  ].map(({ key, placeholder, icon: Icon }) => (
                    <div key={key} className="flex gap-2">
                      <div className="flex items-center px-3 rounded-xl border" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                        <Icon size={14} style={{ color: 'var(--text-secondary)' }} />
                      </div>
                      <input value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none focus:border-purple-500"
                        style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      {key === 'leetcodeUsername' && (
                        <button onClick={syncLeetCode} disabled={leetcodeLoading}
                          className="px-3 py-2 rounded-xl text-xs font-medium" style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                          {leetcodeLoading ? '...' : <RefreshCw size={14} />}
                        </button>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {user?.linkedinUrl && (
                    <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
                      style={{ background: 'rgba(10,102,194,0.1)', color: '#0a66c2' }}>
                      <Link size={13} /> LinkedIn
                    </a>
                  )}
                  {user?.githubUrl && (
                    <a href={user.githubUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                      style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                      <GitBranch size={13} /> GitHub
                    </a>
                  )}
                  {user?.leetcodeUsername && (
                    <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                      style={{ background: 'rgba(255,161,22,0.1)', color: '#ffa116' }}>
                      <Code2 size={13} /> LeetCode: {user.leetcodeSolved || 0} solved
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="text-center">
            <div className="text-2xl font-black" style={{ color: '#7c3aed' }}>{user?.dsaSolvedTotal || 0}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>DSA Solved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black" style={{ color: '#f97316' }}>🔥 {user?.currentStreak || 0}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black" style={{ color: '#06b6d4' }}>{user?.targetPackage || 0}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Target LPA</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Mock Score Timeline */}
        {mockChartData.length > 0 && (
          <div className="card">
            <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Mock Score Timeline</h2>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={mockChartData}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
                  formatter={(v) => [`${v}/100`, 'Score']} />
                <Line type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: '#7c3aed', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Aptitude Radar */}
        <div className="card">
          <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Aptitude Radar</h2>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="topic" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} />
              <Radar dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Aptitude Readiness */}
      <div className={`card`} style={{ borderColor: tcsReady ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)', borderWidth: 2 }}>
        <div className="flex items-center gap-3">
          {tcsReady
            ? <CheckCircle2 size={28} style={{ color: '#22c55e' }} />
            : <XCircle size={28} style={{ color: '#ef4444' }} />}
          <div>
            <div className="font-bold" style={{ color: 'var(--text-primary)' }}>
              TCS NQT Readiness: {tcsReady ? 'Ready! ✅' : 'Not Ready Yet ❌'}
            </div>
            <div className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {aptStats.attempted > 0
                ? `Average Aptitude Score: ${avgApt}/25 (${Math.round(avgApt * 4)}%). TCS cutoff: ~65%.`
                : 'Take aptitude mock tests to check your readiness.'}
              {!tcsReady && aptStats.attempted > 0 && ' Practice more aptitude mocks to improve!'}
            </div>
          </div>
        </div>
        {aptStats.attempted > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="text-center">
              <div className="font-bold text-lg" style={{ color: '#7c3aed' }}>{aptStats.attempted}/20</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Mocks Done</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg" style={{ color: '#22c55e' }}>{aptStats.best}/25</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Best Score</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg" style={{ color: '#06b6d4' }}>{aptStats.average}/25</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Avg Score</div>
            </div>
          </div>
        )}
      </div>

      {/* Email Preferences */}
      {editing && (
        <div className="card space-y-3">
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Email Preferences</h2>
          {[
            { key: 'emailReminders', label: 'Daily DSA Reminders', sub: 'Alert at 11:30 PM if goal not met' },
            { key: 'weeklyReport', label: 'Weekly Progress Reports', sub: 'Every Sunday morning' },
          ].map(({ key, label, sub }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{sub}</div>
              </div>
              <button onClick={() => setForm(p => ({ ...p, [key]: !p[key] }))}
                className={`w-12 h-6 rounded-full transition-all relative ${form[key] ? 'bg-purple-600' : ''}`}
                style={!form[key] ? { background: 'var(--border)' } : {}}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${form[key] ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
