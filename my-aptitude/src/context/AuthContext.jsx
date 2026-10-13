import { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext — local demo authentication state.
 * NOTE: This is strictly a demo/mock mode. No backend calls are made.
 * Phase 7 will wire this to Supabase.
 */

const AuthContext = createContext(null);

const STORAGE_KEY = 'myaptitude_auth';

function loadPersistedUser() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadPersistedUser());
  const [isGuest, setIsGuest] = useState(false);

  // Persist to session storage
  useEffect(() => {
    if (user) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (userData) => {
    const profile = {
      id: `demo-${Date.now()}`,
      name: userData.name || userData.email.split('@')[0],
      email: userData.email,
      xp: 0,
      level: 1,
      streak: 0,
      joinedAt: new Date().toISOString(),
      isDemo: true,
    };
    setUser(profile);
    setIsGuest(false);
    return profile;
  };

  const continueAsGuest = () => {
    const guest = {
      id: `guest-${Date.now()}`,
      name: 'Guest',
      email: null,
      xp: 0,
      level: 1,
      streak: 0,
      isDemo: true,
      isGuest: true,
    };
    setUser(guest);
    setIsGuest(true);
    return guest;
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isGuest, login, continueAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
