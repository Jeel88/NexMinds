import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, signInWithGoogle, signOutSupabase } from '../lib/supabaseClient';

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
  const [authLoading, setAuthLoading] = useState(false);

  // Dynamic Theme (Dark / Light)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('myaptitude_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('myaptitude_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync user from Supabase session & fetch from DB
  const syncSupabaseUser = async (sbUser) => {
    const name = sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Thinker';
    const avatar = sbUser.user_metadata?.avatar_url || sbUser.user_metadata?.picture || null;

    try {
      // Query profiles table from Supabase DB using maybeSingle (doesn't fail if user has no profile yet)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sbUser.id)
        .maybeSingle();

      if (data && !error) {
        setUser({
          id: sbUser.id,
          name: data.name || data.full_name || name,
          email: sbUser.email,
          avatar: data.avatar || data.avatar_url || avatar,
          xp: data.xp ?? 0,
          level: data.level ?? Math.max(1, Math.floor((data.xp || 0) / 250) + 1),
          streak: data.streak ?? 0,
          streakFreeze: 1,
          dailyGoal: 100,
          todayXP: data.today_xp ?? 0,
          accuracy: data.accuracy ?? 100,
          sessionsCount: data.sessions_count ?? 0,
          soundEnabled: true,
          motionEnabled: true,
          joinedAt: data.created_at || sbUser.created_at || new Date().toISOString(),
          isDemo: false,
          provider: sbUser.app_metadata?.provider || 'google',
        });
      } else {
        // Upsert default starter profile in Supabase DB (Starts clean from 0)
        const starterProfile = {
          id: sbUser.id,
          name: name || sbUser.email?.split('@')[0] || 'Thinker',
          full_name: name || sbUser.email?.split('@')[0] || 'Thinker',
          email: sbUser.email || null,
          avatar: avatar || null,
          avatar_url: avatar || null,
          xp: 0,
          level: 1,
          streak: 0,
          today_xp: 0,
          sessions_count: 0,
          updated_at: new Date().toISOString(),
        };

        const { error: upsertErr } = await supabase
          .from('profiles')
          .upsert(starterProfile, { onConflict: 'id' });

        if (upsertErr) {
          console.warn('[Supabase Profiles Upsert Warning]:', upsertErr.message);
          // Secondary fallback attempt: direct insert
          const { error: insertErr } = await supabase
            .from('profiles')
            .insert(starterProfile);
          if (insertErr) {
            console.error('[Supabase Profiles Insert Error]:', insertErr.message);
          } else {
            console.log('[Supabase Profiles]: Starter profile created via insert');
          }
        } else {
          console.log('[Supabase Profiles]: Starter profile synced successfully');
        }

        setUser({
          ...starterProfile,
          streakFreeze: 1,
          dailyGoal: 100,
          accuracy: 100,
          soundEnabled: true,
          motionEnabled: true,
          joinedAt: sbUser.created_at || new Date().toISOString(),
          isDemo: false,
          provider: sbUser.app_metadata?.provider || 'google',
        });
      }
    } catch {
      // Fallback
      setUser({
        id: sbUser.id,
        name,
        email: sbUser.email,
        avatar,
        xp: 0,
        level: 1,
        streak: 0,
        streakFreeze: 1,
        dailyGoal: 100,
        todayXP: 0,
        accuracy: 100,
        sessionsCount: 0,
        soundEnabled: true,
        motionEnabled: true,
        joinedAt: sbUser.created_at || new Date().toISOString(),
        isDemo: false,
        provider: sbUser.app_metadata?.provider || 'google',
      });
    }
  };

  // Listen to Supabase Auth state changes
  useEffect(() => {
    // Clear any failed auth error hash from URL bar
    if (window.location.hash && window.location.hash.includes('error=')) {
      console.warn('[OAuth Hash Detected]:', window.location.hash);
      window.history.replaceState(null, '', window.location.pathname);
    }

    if (!isSupabaseConfigured()) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncSupabaseUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncSupabaseUser(session.user);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Persist to session storage
  useEffect(() => {
    if (user) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const loginWithGoogle = async () => {
    setAuthLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { error } = await signInWithGoogle();
        if (error) throw error;
      } else {
        // Fast instant login fallback if .env is not yet configured
        const fastUser = {
          id: `google-${Date.now()}`,
          name: 'Google Thinker',
          email: 'thinker@gmail.com',
          xp: 0,
          level: 1,
          streak: 0,
          streakFreeze: 1,
          dailyGoal: 100,
          todayXP: 0,
          accuracy: 100,
          sessionsCount: 0,
          soundEnabled: true,
          motionEnabled: true,
          joinedAt: new Date().toISOString(),
          isDemo: true,
          provider: 'google',
        };
        setUser(fastUser);
        setIsGuest(false);
        return fastUser;
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const login = (userData) => {
    const profile = {
      id: `demo-${Date.now()}`,
      name: userData.name || userData.email?.split('@')[0] || 'Thinker',
      email: userData.email,
      xp: 0,
      level: 1,
      streak: 0,
      streakFreeze: 1,
      dailyGoal: 100,
      todayXP: 0,
      accuracy: 100,
      sessionsCount: 0,
      soundEnabled: true,
      motionEnabled: true,
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
      name: 'Guest Thinker',
      email: null,
      xp: 0,
      level: 1,
      streak: 0,
      streakFreeze: 1,
      dailyGoal: 100,
      todayXP: 0,
      accuracy: 100,
      sessionsCount: 0,
      soundEnabled: true,
      motionEnabled: true,
      isDemo: true,
      isGuest: true,
    };
    setUser(guest);
    setIsGuest(true);
    return guest;
  };

  const updateUser = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const addXP = async (amount) => {
    if (!amount || amount <= 0) return;
    setUser((prev) => {
      if (!prev) return null;
      const newXP = (prev.xp || 0) + amount;
      const newTodayXP = (prev.todayXP || 0) + amount;
      const newLevel = Math.max(1, Math.floor(newXP / 250) + 1);
      const newStreak = (prev.streak || 0) === 0 ? 1 : prev.streak;
      const newSessions = (prev.sessionsCount || 0) + 1;

      // Persist to Supabase DB profiles dynamically
      if (isSupabaseConfigured() && prev.id && !prev.isGuest) {
        supabase
          .from('profiles')
          .upsert({
            id: prev.id,
            name: prev.name || 'Thinker',
            email: prev.email || null,
            avatar: prev.avatar || null,
            xp: newXP,
            level: newLevel,
            today_xp: newTodayXP,
            streak: newStreak,
            sessions_count: newSessions,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' })
          .then(({ error }) => {
            if (error) {
              console.warn('[Supabase Profiles Upsert Warning]:', error.message);
            } else {
              console.log('[Supabase Profiles Synced]: +', amount, 'XP -> Total:', newXP);
            }
          })
          .catch((err) => console.warn('Supabase DB update failed:', err));
      }

      return {
        ...prev,
        xp: newXP,
        todayXP: newTodayXP,
        level: newLevel,
        streak: newStreak,
        sessionsCount: newSessions,
      };
    });
  };

  const deductXP = (amount) => {
    setUser((prev) => {
      if (!prev) return null;
      const newXP = Math.max(0, (prev.xp || 0) - amount);

      // Persist to Supabase DB
      if (isSupabaseConfigured() && prev.id && !prev.isGuest) {
        supabase
          .from('profiles')
          .update({ xp: newXP, updated_at: new Date().toISOString() })
          .eq('id', prev.id)
          .then(() => {})
          .catch((err) => console.warn('Supabase DB deduct failed:', err));
      }

      return {
        ...prev,
        xp: newXP,
      };
    });
  };

  const refreshProfile = async () => {
    if (!isSupabaseConfigured() || !user?.id) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (data && !error) {
        setUser((prev) => ({
          ...prev,
          name: data.name || prev?.name,
          avatar: data.avatar || prev?.avatar,
          xp: data.xp ?? prev?.xp ?? 0,
          level: data.level ?? prev?.level ?? 1,
          streak: data.streak ?? prev?.streak ?? 0,
          todayXP: data.today_xp ?? prev?.todayXP ?? 0,
          sessionsCount: data.sessions_count ?? prev?.sessionsCount ?? 0,
        }));
      }
    } catch (e) {
      console.warn('refreshProfile error:', e);
    }
  };

  const resetStats = () => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        xp: 0,
        level: 1,
        streak: 0,
        todayXP: 0,
        sessionsCount: 0,
      };
    });
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await signOutSupabase();
    }
    setUser(null);
    setIsGuest(false);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        authLoading,
        theme,
        toggleTheme,
        login,
        loginWithGoogle,
        continueAsGuest,
        updateUser,
        addXP,
        deductXP,
        refreshProfile,
        resetStats,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
