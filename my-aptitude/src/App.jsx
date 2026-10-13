import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import DashboardPlaceholder from './components/DashboardPlaceholder';

/**
 * Inner app — has access to auth context.
 */
function AppInner() {
  const { user, login, continueAsGuest } = useAuth();

  // Modal state: null | 'onboarding' | 'login' | 'signup'
  const [modalMode, setModalMode] = useState(null);

  const openModal = (mode) => setModalMode(mode);
  const closeModal = () => setModalMode(null);

  const handleAuthSuccess = (userData) => {
    login(userData);
    closeModal();
  };

  const handleGuest = () => {
    continueAsGuest();
    closeModal();
  };

  // If user is logged in (or guest), show dashboard
  if (user) {
    return <DashboardPlaceholder />;
  }

  return (
    <>
      {/* Navigation */}
      <Navbar
        onLogin={() => openModal('login')}
        onSignup={() => openModal('onboarding')}
      />

      {/* Landing / Home page */}
      <LandingPage
        onLogin={() => openModal('login')}
        onSignup={() => openModal('onboarding')}
        onGuest={handleGuest}
      />

      {/* Auth Modal (conditionally rendered) */}
      {modalMode && (
        <AuthModal
          mode={modalMode}
          onClose={closeModal}
          onAuthSuccess={handleAuthSuccess}
          onGuest={handleGuest}
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
