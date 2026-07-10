import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '../types/database';

// ─── Local Storage Keys (offline cache) ──────────────────────────────────
const CACHE_PROFILE = 'medfield_cached_profile';
const CACHE_USER = 'medfield_cached_user';

function cacheToStorage(key: string, data: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* quota exceeded or private mode */ }
}

function readFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

// ─── Context Type ─────────────────────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isOnline: boolean;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Pick<Profile, 'name' | 'phone' | 'avatar_url'>>) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(readFromStorage<Profile>(CACHE_PROFILE));
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Track online/offline status
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // ── Fetch profile from Supabase ──
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile(data);
      cacheToStorage(CACHE_PROFILE, data);
    }
    return data;
  }, []);

  // ── Initialize: restore session ──
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          cacheToStorage(CACHE_USER, currentSession.user);
          await fetchProfile(currentSession.user.id);
        } else {
          // Offline fallback: use cached user
          const cachedUser = readFromStorage<User>(CACHE_USER);
          if (cachedUser && !navigator.onLine) {
            setUser(cachedUser);
            // profile already loaded from cache in useState init
          }
        }
      } catch {
        // Network error — use cached data
        const cachedUser = readFromStorage<User>(CACHE_USER);
        if (cachedUser) {
          setUser(cachedUser);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          cacheToStorage(CACHE_USER, newSession.user);
          await fetchProfile(newSession.user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          localStorage.removeItem(CACHE_PROFILE);
          localStorage.removeItem(CACHE_USER);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // ── Sign Up ──
  const signUp = useCallback(async (
    email: string,
    password: string,
    name: string,
    phone?: string,
  ): Promise<{ error: string | null }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone: phone || '' },
      },
    });

    if (error) return { error: error.message };

    // Create profile row
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name,
          phone: phone || null,
          member_tier: 'standard',
        } as any);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Non-fatal: user is created, profile can be retried
      }

      await fetchProfile(data.user.id);
    }

    return { error: null };
  }, [fetchProfile]);

  // ── Sign In ──
  const signIn = useCallback(async (
    email: string,
    password: string,
  ): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  // ── Sign Out ──
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    localStorage.removeItem(CACHE_PROFILE);
    localStorage.removeItem(CACHE_USER);
  }, []);

  // ── Update Profile ──
  const updateProfile = useCallback(async (
    data: Partial<Pick<Profile, 'name' | 'phone' | 'avatar_url'>>,
  ): Promise<{ error: string | null }> => {
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
      .from('profiles')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) return { error: error.message };

    await fetchProfile(user.id);
    return { error: null };
  }, [user, fetchProfile]);

  // ── Refresh Profile ──
  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isOnline,
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
