import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCw, Search, Flame, Code2, Star, Medal } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PODIUM_COLORS = {
  1: { bg: 'linear-gradient(135deg, #f59e0b, #fbbf24)', border: '#f59e0b', label: '🥇', textColor: '#92400e' },
  2: { bg: 'linear-gradient(135deg, #94a3b8, #cbd5e1)', border: '#94a3b8', label: '🥈', textColor: '#334155' },
  3: { bg: 'linear-gradient(135deg, #cd7f32, #d97706)', border: '#cd7f32', label: '🥉', textColor: '#78350f' },
};

function Avatar({ name, size = 40 }) {
  const initials = name
    ? name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
    : '?';
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      color: 'white',
      fontSize: size * 0.35,
      flexShrink: 0
    }}>
      {initials}
    </div>
  );
}

function PodiumCard({ user, rank }) {
  const config = PODIUM_COLORS[rank];
  const heights = { 1: 130, 2: 100, 3: 80 };
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.12, type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        flex: rank === 1 ? '0 0 180px' : '0 0 150px',
        order: rank === 1 ? 0 : rank === 2 ? -1 : 1,
      }}
    >
      <div style={{ position: 'relative' }}>
        <Avatar name={user.name} size={rank === 1 ? 64 : 52} />
        <span style={{
          position: 'absolute',
          bottom: -6,
          right: -6,
          fontSize: rank === 1 ? 24 : 18,
          lineHeight: 1
        }}>{config.label}</span>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: rank === 1 ? 16 : 14, margin: 0 }}>{user.name}</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 11, margin: '2px 0 0' }}>{user.college || 'Unknown'}</p>
        <p style={{ fontWeight: 800, fontSize: rank === 1 ? 22 : 18, background: config.bg, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '4px 0 0' }}>{user.score}</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 11, margin: 0 }}>pts</p>
      </div>
      <div
        style={{
          width: '100%',
          height: heights[rank],
          background: config.bg,
          borderRadius: '12px 12px 0 0',
          border: `1px solid ${config.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          fontWeight: 900,
          color: config.textColor,
          opacity: 0.9
        }}
      >
        #{rank}
      </div>
    </motion.div>
  );
}

export default function Leaderboard() {
  const { user: currentUser } = useAuth();
  const [tab, setTab] = useState('overall');
  const [users, setUsers] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (showToast = false) => {
    if (showToast) setRefreshing(true);
    else setLoading(true);
    try {
      const [boardRes, rankRes] = await Promise.all([
        api.get(`/leaderboard?type=${tab}&limit=50`),
        api.get('/leaderboard/my-rank')
      ]);
      setUsers(boardRes.data.users || []);
      setMyRank(rankRes.data);
      if (showToast) toast.success('Leaderboard refreshed');
    } catch {
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [tab]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = search.trim()
    ? users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.college?.toLowerCase().includes(search.toLowerCase()))
    : users;

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  const myEntry = users.find(u => u._id === currentUser?._id || u._id?.toString() === currentUser?._id?.toString());

  return (
    <div style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'linear-gradient(135deg, #f59e0b, #7c3aed)', borderRadius: 12, padding: 10 }}>
              <Trophy size={24} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Leaderboard</h1>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 14 }}>See how you rank among your peers</p>
            </div>
          </div>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
          >
            <RefreshCw size={15} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* My Rank Card */}
      {myRank && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.10))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 14, padding: '16px 20px', marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Medal size={20} color="#7c3aed" />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Your Rank</span>
          </div>
          {[
            { label: 'Overall Rank', value: myRank.overallRank ? `#${myRank.overallRank}` : 'N/A', sub: `of ${myRank.totalUsers}` },
            { label: 'College Rank', value: myRank.collegeRank ? `#${myRank.collegeRank}` : 'N/A', sub: `of ${myRank.totalCollegeUsers}` },
            { label: 'Score', value: myRank.score, sub: 'points' },
            { label: 'DSA Solved', value: myRank.dsaSolvedTotal, sub: 'questions' },
            { label: 'Streak', value: myRank.currentStreak, sub: 'days' },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 800, fontSize: 20, color: '#7c3aed', margin: 0 }}>{item.value}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 12, margin: 0 }}>{item.label}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 11, margin: 0 }}>{item.sub}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Tabs + Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 4, gap: 4 }}>
          {['overall', 'college'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                border: 'none',
                background: tab === t ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'transparent',
                color: tab === t ? 'white' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 14,
                textTransform: 'capitalize'
              }}
            >
              {t === 'overall' ? 'Overall' : 'My College'}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or college..."
            style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, boxSizing: 'border-box' }}
          />
        </div>
      </motion.div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          <Trophy size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
          <p style={{ fontSize: 16 }}>No users found</p>
        </div>
      ) : (
        <>
          {/* Podium — top 3 */}
          {top3.length >= 1 && !search && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="card"
              style={{ marginBottom: 24, padding: '24px 20px 0' }}
            >
              <p style={{ textAlign: 'center', fontWeight: 700, fontSize: 15, color: 'var(--text-secondary)', marginBottom: 20, letterSpacing: 2, textTransform: 'uppercase', fontSize: 12 }}>Top Performers</p>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
                {top3.map(u => <PodiumCard key={u._id} user={u} rank={u.rank} />)}
              </div>
            </motion.div>
          )}

          {/* Rankings Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
            style={{ overflow: 'hidden' }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Rank', 'User', 'College', 'DSA', 'Streak', 'Score'].map(h => (
                      <th key={h} style={{ padding: '12px 14px', textAlign: h === 'Rank' ? 'center' : 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {(search ? filtered : rest).map((u, idx) => {
                      const isMe = u._id?.toString() === currentUser?._id?.toString();
                      return (
                        <motion.tr
                          key={u._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          style={{
                            borderBottom: '1px solid var(--border)',
                            background: isMe ? 'rgba(124,58,237,0.08)' : 'transparent',
                          }}
                        >
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <span style={{
                              fontWeight: 700,
                              fontSize: 14,
                              color: u.rank <= 3 ? ['#f59e0b', '#94a3b8', '#cd7f32'][u.rank - 1] : 'var(--text-secondary)'
                            }}>
                              {u.rank <= 3 ? ['🥇', '🥈', '🥉'][u.rank - 1] : `#${u.rank}`}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <Avatar name={u.name} size={34} />
                              <div>
                                <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>
                                  {u.name} {isMe && <span style={{ fontSize: 11, color: '#7c3aed', marginLeft: 4 }}>(you)</span>}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontSize: 13, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {u.college || '—'}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-primary)', fontSize: 14 }}>
                              <Code2 size={14} color="#7c3aed" />
                              {u.dsaSolvedTotal}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14 }}>
                              <Flame size={14} color="#f59e0b" />
                              <span style={{ color: 'var(--text-primary)' }}>{u.currentStreak}d</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontWeight: 700, fontSize: 15, color: '#7c3aed' }}>{u.score}</span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Sticky my rank if not in list */}
          {!myEntry && myRank && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ position: 'sticky', bottom: 16, marginTop: 12, background: 'linear-gradient(135deg, rgba(124,58,237,0.9), rgba(6,182,212,0.85))', borderRadius: 14, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white', backdropFilter: 'blur(10px)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={currentUser?.name} size={36} />
                <div>
                  <p style={{ margin: 0, fontWeight: 700 }}>{currentUser?.name} (you)</p>
                  <p style={{ margin: 0, fontSize: 12, opacity: 0.85 }}>Rank #{myRank.overallRank} of {myRank.totalUsers}</p>
                </div>
              </div>
              <span style={{ fontWeight: 800, fontSize: 20 }}>{myRank.score} pts</span>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
