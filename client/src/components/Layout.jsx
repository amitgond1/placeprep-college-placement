import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Code2,
  Mic,
  FileText,
  Building2,
  GraduationCap,
  Calculator,
  TrendingUp,
  User,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Brain,
  Layers,
  Flame,
  Trophy,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from './Navbar';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'DSA Tracker', icon: Code2, path: '/dsa' },
  { label: 'Mock Interview', icon: Mic, path: '/mock' },
  { label: 'Resume', icon: FileText, path: '/resume' },
  { label: 'Companies', icon: Building2, path: '/companies' },
  { label: 'College Tracker', icon: GraduationCap, path: '/college' },
  {
    label: 'Aptitude Prep',
    icon: Calculator,
    path: '/aptitude',
    prefix: '📐',
    subItems: [
      { label: 'Mock Tests', path: '/aptitude?tab=mocks' },
      { label: 'Topic Drill', path: '/aptitude?tab=drill' },
      { label: 'Study Guide', path: '/aptitude?tab=guide' },
      { label: 'Prev Year Qs', path: '/aptitude?tab=pyq' },
      { label: 'Company Patterns', path: '/aptitude?tab=patterns' },
      { label: 'My Results', path: '/aptitude?tab=results' },
    ],
  },
  { label: 'Core Subjects', icon: GraduationCap, path: '/core-subjects' },
  { label: 'Interview Prep', icon: Brain, path: '/interview-prep' },
  { label: 'Flash Cards', icon: Layers, path: '/flashcards' },
  { label: 'Daily Challenge', icon: Flame, path: '/daily' },
  { label: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
  { label: 'Experiences', icon: Users, path: '/experiences' },
  { label: 'Package Calc', icon: TrendingUp, path: '/calculator' },
  { label: 'Profile', icon: User, path: '/profile' },
];

const BOTTOM_TAB_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'DSA', icon: Code2, path: '/dsa' },
  { label: 'Interview', icon: Mic, path: '/mock' },
  { label: 'Companies', icon: Building2, path: '/companies' },
  { label: 'Profile', icon: User, path: '/profile' },
];

export default function Layout() {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isCompilerPage = location.pathname.startsWith('/compiler/');
  const isFullScreenPage = isCompilerPage || location.pathname.startsWith('/aptitude/mock/');

  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    return stored === 'true';
  });
  const [aptitudeOpen, setAptitudeOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarVariants = {
    expanded: { width: 240 },
    collapsed: { width: 72 },
  };

  const mobileSidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 },
  };

  const renderNavItem = (item, isMobile = false) => {
    const Icon = item.icon;
    const hasSubItems = item.subItems && item.subItems.length > 0;

    if (hasSubItems) {
      return (
        <div key={item.path}>
          <button
            onClick={() => setAptitudeOpen((prev) => !prev)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
              text-[var(--text-secondary)] hover:text-[var(--text-primary)]
              hover:bg-white/5 group
              ${collapsed && !isMobile ? 'justify-center' : ''}
            `}
            title={collapsed && !isMobile ? item.label : ''}
          >
            <span className="flex-shrink-0 text-base">{item.prefix}</span>
            {(!collapsed || isMobile) && (
              <>
                <span className="flex-1 text-sm font-medium text-left">{item.label}</span>
                {aptitudeOpen ? (
                  <ChevronUp className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                )}
              </>
            )}
          </button>
          <AnimatePresence>
            {aptitudeOpen && (!collapsed || isMobile) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden ml-4 border-l border-white/10 pl-3 mt-1 space-y-1"
              >
                {item.subItems.map((sub) => (
                  <NavLink
                    key={sub.path}
                    to={sub.path}
                    onClick={() => isMobile && setMobileSidebarOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        isActive
                          ? 'text-[#06b6d4] bg-[#06b6d4]/10'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                      }`
                    }
                  >
                    {sub.label}
                  </NavLink>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={() => isMobile && setMobileSidebarOpen(false)}
        title={collapsed && !isMobile ? item.label : ''}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
          ${collapsed && !isMobile ? 'justify-center' : ''}
          ${
            isActive
              ? 'bg-gradient-to-r from-[#7c3aed]/20 to-[#06b6d4]/20 text-[#06b6d4] border border-[#7c3aed]/30'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                isActive ? 'text-[#7c3aed]' : 'group-hover:text-[#7c3aed]'
              }`}
            />
            {(!collapsed || isMobile) && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </>
        )}
      </NavLink>
    );
  };

  // Full-screen for compiler — hide sidebar and navbar
  if (isFullScreenPage) {
    return (
      <div className="h-screen w-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Desktop Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={collapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex flex-col h-full flex-shrink-0 border-r border-white/10 relative"
        style={{ background: 'var(--bg-card)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
            🎯
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-base whitespace-nowrap text-[var(--text-primary)]"
              >
                PlacePrep
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1 scrollbar-hide">
          {NAV_ITEMS.map((item) => renderNavItem(item))}
        </nav>

        {/* Bottom Actions */}
        <div className="px-2 py-4 border-t border-white/10 space-y-1">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all duration-200"
            title={collapsed ? (theme === 'dark' ? 'Light mode' : 'Dark mode') : ''}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 flex-shrink-0 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 flex-shrink-0 text-[#7c3aed]" />
            )}
            {!collapsed && (
              <span className="text-sm font-medium">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
            title={collapsed ? 'Logout' : ''}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-white/20 bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#7c3aed] transition-all duration-200 shadow-md z-10"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              variants={mobileSidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed left-0 top-0 h-full w-64 z-50 md:hidden flex flex-col border-r border-white/10"
              style={{ background: 'var(--bg-card)' }}
            >
              <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center text-white font-bold text-sm">
                    🎯
                  </div>
                  <span className="font-bold text-base text-[var(--text-primary)]">PlacePrep</span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
                {NAV_ITEMS.map((item) => renderNavItem(item, true))}
              </nav>
              <div className="px-2 py-4 border-t border-white/10 space-y-1">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all duration-200"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 flex-shrink-0 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 flex-shrink-0 text-[#7c3aed]" />
                  )}
                  <span className="text-sm font-medium">
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile Header with hamburger */}
        <div
          className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-white/10"
          style={{ background: 'var(--bg-card)' }}
        >
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center text-white text-xs">
              🎯
            </div>
            <span className="font-bold text-sm text-[var(--text-primary)]">PlacePrep</span>
          </div>
        </div>

        {/* Desktop Navbar */}
        <div className="hidden md:block">
          <Navbar />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 md:hidden border-t border-white/10 z-30"
        style={{ background: 'var(--bg-card)' }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {BOTTOM_TAB_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-0 ${
                    isActive
                      ? 'text-[#7c3aed]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#7c3aed]' : ''}`}
                    />
                    <span className="text-[10px] font-medium truncate">{item.label}</span>
                    {isActive && (
                      <span className="w-1 h-1 rounded-full bg-[#7c3aed] mt-0.5" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
