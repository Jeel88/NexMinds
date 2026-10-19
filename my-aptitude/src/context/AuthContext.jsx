import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, signInWithGoogle, signOutSupabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

const STORAGE_KEY = 'myaptitude_auth';

export const DEFAULT_RATINGS = {
  math: 1200,
  puzzle: 1200,
  logic: 1200,
  memory: 1200,
};

export const DEFAULT_TRENDS = {
  math: '+0 —',
  puzzle: '+0 —',
  logic: '+0 —',
  memory: '+0 —',
};

function loadPersistedUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed) {
      if (!parsed.ratings || Object.keys(parsed.ratings).length === 0) {
        const savedRatings = localStorage.getItem(`myaptitude_ratings_${parsed.id}`);
        if (savedRatings) {
          try { parsed.ratings = JSON.parse(savedRatings); } catch {}
        }
      }
      if (!parsed.ratingTrends || Object.keys(parsed.ratingTrends).length === 0) {
        const savedTrends = localStorage.getItem(`myaptitude_trends_${parsed.id}`);
        if (savedTrends) {
          try { parsed.ratingTrends = JSON.parse(savedTrends); } catch {}
        }
      }
      parsed.ratings = { ...DEFAULT_RATINGS, ...(parsed.ratings || {}) };
      parsed.ratingTrends = { ...DEFAULT_TRENDS, ...(parsed.ratingTrends || {}) };
    }
    return parsed;
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

      // Resolve ratings dynamically from:
      // 1. Supabase profiles DB table
      // 2. Supabase Auth user_metadata (stored in Supabase auth.users DB)
      // 3. LocalStorage persistent cache
      // 4. Default 1200 baseline
      let fetchedRatings = data?.ratings;
      let fetchedTrends = data?.rating_trends;

      if (typeof fetchedRatings === 'string') {
        try { fetchedRatings = JSON.parse(fetchedRatings); } catch {}
      }
      if (typeof fetchedTrends === 'string') {
        try { fetchedTrends = JSON.parse(fetchedTrends); } catch {}
      }

      // Check Supabase Auth metadata
      if (!fetchedRatings || Object.keys(fetchedRatings).length === 0) {
        fetchedRatings = sbUser.user_metadata?.ratings;
      }
      if (!fetchedTrends || Object.keys(fetchedTrends).length === 0) {
        fetchedTrends = sbUser.user_metadata?.rating_trends;
      }

      // Check LocalStorage cache for this user
      const localRatingsKey = `myaptitude_ratings_${sbUser.id}`;
      const localTrendsKey = `myaptitude_trends_${sbUser.id}`;
      if (!fetchedRatings || Object.keys(fetchedRatings).length === 0) {
        try {
          const rawLocal = localStorage.getItem(localRatingsKey);
          if (rawLocal) fetchedRatings = JSON.parse(rawLocal);
        } catch {}
      }
      if (!fetchedTrends || Object.keys(fetchedTrends).length === 0) {
        try {
          const rawLocal = localStorage.getItem(localTrendsKey);
          if (rawLocal) fetchedTrends = JSON.parse(rawLocal);
        } catch {}
      }

      const resolvedRatings = {
        ...DEFAULT_RATINGS,
        ...(fetchedRatings || {}),
      };

      const resolvedTrends = {
        ...DEFAULT_TRENDS,
        ...(fetchedTrends || {}),
      };

      // Always save back to localStorage for resilience
      try {
        localStorage.setItem(localRatingsKey, JSON.stringify(resolvedRatings));
        localStorage.setItem(localTrendsKey, JSON.stringify(resolvedTrends));
      } catch {}

      // If Supabase Auth metadata didn't have ratings yet, backfill into Auth metadata
      if (!sbUser.user_metadata?.ratings && isSupabaseConfigured()) {
        supabase.auth.updateUser({
          data: {
            ratings: resolvedRatings,
            rating_trends: resolvedTrends,
          },
        }).catch(() => {});
      }

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
          ratings: resolvedRatings,
          ratingTrends: resolvedTrends,
          soundEnabled: true,
          motionEnabled: true,
          joinedAt: data.created_at || sbUser.created_at || new Date().toISOString(),
          isDemo: false,
          provider: sbUser.app_metadata?.provider || 'google',
        });

        // If profiles table in DB doesn't have ratings populated yet, sync it
        if (!data.ratings && isSupabaseConfigured()) {
          supabase
            .from('profiles')
            .update({
              ratings: resolvedRatings,
              rating_trends: resolvedTrends,
              updated_at: new Date().toISOString(),
            })
            .eq('id', sbUser.id)
            .then(() => {})
            .catch(() => {});
        }
      } else {
        // Upsert default starter profile in Supabase DB
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
          ratings: resolvedRatings,
          rating_trends: resolvedTrends,
          updated_at: new Date().toISOString(),
        };

        const { error: upsertErr } = await supabase
          .from('profiles')
          .upsert(starterProfile, { onConflict: 'id' });

        if (upsertErr) {
          console.warn('[Supabase Profiles Upsert Warning]:', upsertErr.message);
          // Fallback attempt without extra columns if column does not exist yet
          const safeStarter = {
            id: sbUser.id,
            name: starterProfile.name,
            full_name: starterProfile.full_name,
            email: starterProfile.email,
            avatar: starterProfile.avatar,
            avatar_url: starterProfile.avatar_url,
            xp: 0,
            level: 1,
            streak: 0,
            today_xp: 0,
            sessions_count: 0,
            updated_at: new Date().toISOString(),
          };
          await supabase.from('profiles').upsert(safeStarter, { onConflict: 'id' });
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
        ratings: DEFAULT_RATINGS,
        ratingTrends: DEFAULT_TRENDS,
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

  // Persist to local & session storage
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        if (user.id && user.ratings) {
          localStorage.setItem(`myaptitude_ratings_${user.id}`, JSON.stringify(user.ratings));
        }
        if (user.id && user.ratingTrends) {
          localStorage.setItem(`myaptitude_trends_${user.id}`, JSON.stringify(user.ratingTrends));
        }
      } catch {}
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
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
          ratings: DEFAULT_RATINGS,
          ratingTrends: DEFAULT_TRENDS,
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
      ratings: DEFAULT_RATINGS,
      ratingTrends: DEFAULT_TRENDS,
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
      ratings: DEFAULT_RATINGS,
      ratingTrends: DEFAULT_TRENDS,
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
        let dbRatings = data.ratings;
        if (typeof dbRatings === 'string') {
          try { dbRatings = JSON.parse(dbRatings); } catch {}
        }
        let dbTrends = data.rating_trends;
        if (typeof dbTrends === 'string') {
          try { dbTrends = JSON.parse(dbTrends); } catch {}
        }

        setUser((prev) => ({
          ...prev,
          name: data.name || prev?.name,
          avatar: data.avatar || prev?.avatar,
          xp: data.xp ?? prev?.xp ?? 0,
          level: data.level ?? prev?.level ?? 1,
          streak: data.streak ?? prev?.streak ?? 0,
          todayXP: data.today_xp ?? prev?.todayXP ?? 0,
          sessionsCount: data.sessions_count ?? prev?.sessionsCount ?? 0,
          ratings: dbRatings || prev?.ratings || DEFAULT_RATINGS,
          ratingTrends: dbTrends || prev?.ratingTrends || DEFAULT_TRENDS,
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

  const recordQuizResult = async ({ category, score, total, xpEarned }) => {
    const catKey = (category || 'math').toLowerCase();
    const mappedKey = (catKey === 'quantitative') ? 'math' 
      : (catKey === 'pattern') ? 'puzzle' 
      : (catKey === 'numerical') ? 'memory' 
      : catKey;
    const validKey = ['math', 'puzzle', 'logic', 'memory'].includes(mappedKey) ? mappedKey : 'math';
    const accuracy = total > 0 ? score / total : 0;
    
    // Rating adjustment: if accuracy >= 0.8: +15~35; if >= 0.5: +5~15; else: -5~10
    let delta = 0;
    if (accuracy >= 0.8) {
      delta = Math.round(20 + accuracy * 15);
    } else if (accuracy >= 0.6) {
      delta = Math.round(10 + accuracy * 10);
    } else if (accuracy >= 0.4) {
      delta = 5;
    } else {
      delta = -8;
    }

    setUser((prev) => {
      if (!prev) return null;
      const currentRatings = {
        ...DEFAULT_RATINGS,
        ...(prev.ratings || {}),
      };
      const oldRating = Number(currentRatings[validKey]) || 1200;
      const newRating = Math.max(800, oldRating + delta);
      const trendTag = delta >= 0 ? `+${delta} ↑` : `${delta} ↓`;

      const updatedRatings = {
        ...currentRatings,
        [validKey]: newRating,
      };

      const updatedTrends = {
        ...DEFAULT_TRENDS,
        ...(prev.ratingTrends || {}),
        [validKey]: trendTag,
      };

      // 1. Immediately persist to localStorage for this specific user
      if (prev.id) {
        try {
          localStorage.setItem(`myaptitude_ratings_${prev.id}`, JSON.stringify(updatedRatings));
          localStorage.setItem(`myaptitude_trends_${prev.id}`, JSON.stringify(updatedTrends));
        } catch {}
      }

      // 2. Persist to Supabase Database (profiles table) & Supabase Auth DB (user_metadata)
      if (isSupabaseConfigured() && prev.id && !prev.isGuest) {
        // A. Update Supabase profiles table
        supabase
          .from('profiles')
          .update({
            ratings: updatedRatings,
            rating_trends: updatedTrends,
            updated_at: new Date().toISOString(),
          })
          .eq('id', prev.id)
          .then(({ error }) => {
            if (error) {
              console.warn('[Supabase Profiles Ratings Update Note]:', error.message);
            } else {
              console.log('[Supabase Profiles Ratings Synced]:', validKey, '->', newRating);
            }
          })
          .catch((err) => console.warn('Supabase DB rating update error:', err));

        // B. Update Supabase Auth user_metadata directly in Supabase cloud
        supabase.auth
          .updateUser({
            data: {
              ratings: updatedRatings,
              rating_trends: updatedTrends,
            },
          })
          .then(({ error }) => {
            if (error) {
              console.warn('[Supabase Auth User Metadata Note]:', error.message);
            } else {
              console.log('[Supabase Auth Metadata Rating Synced]');
            }
          })
          .catch((err) => console.warn('Supabase Auth metadata update error:', err));
      }

      return {
        ...prev,
        ratings: updatedRatings,
        ratingTrends: updatedTrends,
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
    localStorage.removeItem(STORAGE_KEY);
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
        recordQuizResult,
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
