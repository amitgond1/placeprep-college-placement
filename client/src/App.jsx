import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import DSATracker from './pages/DSATracker';
import MockInterview from './pages/MockInterview';
import ResumeBuilder from './pages/ResumeBuilder';
import CompaniesGuide from './pages/CompaniesGuide';
import CollegeTracker from './pages/CollegeTracker';
import PackageCalculator from './pages/PackageCalculator';
import AptitudePrep from './pages/AptitudePrep';
import AptitudeMockTest from './pages/AptitudeMockTest';
import AptitudeResults from './pages/AptitudeResults';
import Profile from './pages/Profile';
import Compiler from './pages/Compiler';
import Layout from './components/Layout';

if (typeof window !== 'undefined') {
  const pendingPath = sessionStorage.getItem('placeprep_pending_path');
  if (pendingPath) {
    sessionStorage.removeItem('placeprep_pending_path');
    window.history.replaceState(null, '', pendingPath);
  }
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{background:'var(--bg-primary)'}}>
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isOnboarded) return <Navigate to="/onboarding" replace />;
  return children;
}

function OnboardingRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.isOnboarded) return <Navigate to="/dashboard" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={user.isOnboarded ? '/dashboard' : '/onboarding'} replace />;
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{
            style: { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }
          }} />
          <Routes>
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/onboarding" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dsa" element={<DSATracker />} />
              <Route path="/mock" element={<MockInterview />} />
              <Route path="/resume" element={<ResumeBuilder />} />
              <Route path="/companies" element={<CompaniesGuide />} />
              <Route path="/college" element={<CollegeTracker />} />
              <Route path="/calculator" element={<PackageCalculator />} />
              <Route path="/aptitude" element={<AptitudePrep />} />
              <Route path="/aptitude/mock-tests" element={<Navigate to="/aptitude?tab=mocks" replace />} />
              <Route path="/aptitude/topic-drill" element={<Navigate to="/aptitude?tab=drill" replace />} />
              <Route path="/aptitude/company-patterns" element={<Navigate to="/aptitude?tab=patterns" replace />} />
              <Route path="/aptitude/my-results" element={<Navigate to="/aptitude?tab=results" replace />} />
              <Route path="/aptitude/mock/:mockId" element={<AptitudeMockTest />} />
              <Route path="/aptitude/results/:resultId" element={<AptitudeResults />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/compiler/:id" element={<Compiler />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
