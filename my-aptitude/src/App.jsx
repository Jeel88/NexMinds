import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';

/**
 * Inner app — has access to auth context.
 */
function AppInner() {
  const { user, login } = useAuth();

  // Modal state: null | 'onboarding' | 'login' | 'signup'
  const [modalMode, setModalMode] = useState(null);

  const openModal = (mode) => setModalMode(mode);
  const closeModal = () => setModalMode(null);

  const handleAuthSuccess = (userData) => {
    login(userData);
    closeModal();
  };

  // If user is logged in, show dashboard
  if (user) {
    return <Dashboard />;
  }

  return (
    <>
      {/* Navigation */}
      <Navbar
        onLogin={() => openModal('login')}
        onSignup={() => openModal('login')}
      />

      {/* Landing / Home page */}
      <LandingPage
        onLogin={() => openModal('login')}
        onSignup={() => openModal('login')}
      />

      {/* Auth Modal (conditionally rendered) */}
      {modalMode && (
        <AuthModal
          mode={modalMode}
          onClose={closeModal}
          onAuthSuccess={handleAuthSuccess}
          onSwitchMode={setModalMode}
        />
      )}
    </>
  );
}

/**
 * Root App — wraps everything in providers.
 */
export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
