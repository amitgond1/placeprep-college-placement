import { useState } from 'react';
import { Bell, Sun, Moon, Flame, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function getInitials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarGradient(name = '') {
  const colors = [
    'from-[#7c3aed] to-[#06b6d4]',
    'from-[#06b6d4] to-[#1a1a2e]',
    'from-[#ec4899] to-[#7c3aed]',
    'from-[#f59e0b] to-[#ef4444]',
    'from-[#10b981] to-[#06b6d4]',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index] || colors[0];
}

export default function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('pp_read_notifs') || '[]')); }
    catch { return new Set(); }
  });

  const userName = user?.name || 'Student';
  const userCollege = user?.college || 'College not set';
  const userStreak = user?.currentStreak ?? user?.streak ?? 0;
  const userAvatar = user?.avatar || null;
  const initials = getInitials(userName);
  const gradient = getAvatarGradient(userName);

  const dsaToday = user?.dsaSolvedToday ?? 0;
  const dsaTotal = user?.dsaSolvedTotal ?? 0;

  const notifications = [
    ...(userStreak >= 3 ? [{ id: 'streak', text: `🔥 ${userStreak}-day streak! You're on fire — keep it up!`, time: 'now', unread: !readIds.has('streak') }] : []),
    ...(dsaToday > 0 ? [{ id: 'today', text: `✅ You solved ${dsaToday} DSA problem${dsaToday > 1 ? 's' : ''} today! Great work!`, time: 'today', unread: !readIds.has('today') }] : []),
    ...(dsaTotal >= 10 && dsaTotal % 10 === 0 ? [{ id: `mile${dsaTotal}`, text: `🏆 Milestone! You've solved ${dsaTotal} DSA problems total!`, time: 'recently', unread: !readIds.has(`mile${dsaTotal}`) }] : []),
    { id: 'flashcards', text: '🆕 Flash Cards added! Revise Aptitude, OS, DBMS, OOP formulas quickly.', time: '1d ago', unread: !readIds.has('flashcards') },
    { id: 'interviewprep', text: '🆕 Interview Prep added! HR Q&A, GD Topics & more inside.', time: '1d ago', unread: !readIds.has('interviewprep') },
    { id: 'tip', text: '💡 Tip: Solve 1 aptitude mock test daily for campus placements.', time: '2d ago', unread: !readIds.has('tip') },
  ];

  const markRead = (ids) => {
    const next = new Set([...readIds, ...ids]);
    setReadIds(next);
    try { localStorage.setItem('pp_read_notifs', JSON.stringify([...next])); } catch {}
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header
      className="w-full px-6 py-3 border-b border-white/10 flex items-center justify-between gap-4"
      style={{ background: 'var(--bg-card)' }}
    >
      {/* Left: User Info */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Avatar */}
        {userAvatar ? (
          <img
            src={userAvatar}
            alt={userName}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#7c3aed]/40 flex-shrink-0"
          />
        ) : (
          <div
            className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 ring-2 ring-[#7c3aed]/40`}
          >
            <span className="text-white text-sm font-semibold">{initials}</span>
          </div>
        )}

        {/* Name + College */}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate leading-tight">
            {userName}
          </p>
          <p className="text-xs text-[var(--text-secondary)] truncate leading-tight">
            {userCollege}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Streak Counter */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20"
        >
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-bold text-orange-400">{userStreak}</span>
          <span className="text-xs text-[var(--text-secondary)] hidden sm:inline">day streak</span>
        </motion.div>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all duration-200 border border-white/10"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <AnimatePresence mode="wait">
            {theme === 'dark' ? (
              <motion.span
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-4 h-4 text-yellow-400" />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-4 h-4 text-[#7c3aed]" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Notification Bell */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNotifOpen((prev) => !prev)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all duration-200 border border-white/10 relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#7c3aed] text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </motion.button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {notifOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setNotifOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-white/10 shadow-2xl z-20 overflow-hidden"
                  style={{ background: 'var(--bg-card)' }}
                >
                  <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      Notifications
                    </span>
                    <span
                      className="text-xs text-[#7c3aed] font-medium cursor-pointer hover:underline"
                      onClick={() => markRead(notifications.map(n => n.id))}
                    >
                      Mark all read
                    </span>
                  </div>
                  <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markRead([notif.id])}
                        className={`px-4 py-3 flex gap-3 hover:bg-white/5 transition-colors cursor-pointer ${
                          notif.unread ? 'bg-[#7c3aed]/5' : ''
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            notif.unread ? 'bg-[#7c3aed]' : 'bg-transparent'
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                            {notif.text}
                          </p>
                          <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
