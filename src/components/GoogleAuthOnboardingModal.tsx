import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ShieldCheck, Phone, User, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { createPortal } from 'react-dom';

export const GoogleAuthOnboardingModal: React.FC = () => {
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  
  const isGoogleUser = user?.app_metadata?.provider === 'google' || user?.app_metadata?.providers?.includes('google');
  const needsOnboarding = Boolean(user && profile && isGoogleUser && (!profile.phone || profile.phone.trim() === ''));

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (needsOnboarding && user) {
      const initialName = profile?.name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '';
      setName(initialName);
    }
  }, [needsOnboarding, user, profile]);

  if (!needsOnboarding) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !password) {
      setErrorMsg('Please verify your name, enter your phone number, and set a password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Save password to Supabase Auth so user can also login with email + password anytime
      const { error: authError } = await supabase.auth.updateUser({
        password: password,
        data: {
          name: name.trim(),
          phone: phone.trim(),
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // 2. Update user profile row
      const { error: profileError } = await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
      });

      if (profileError) {
        throw new Error(profileError);
      }

      // 3. Refresh profile state in AuthContext so modal closes
      await refreshProfile();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete account setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl shadow-2xl border border-outline-variant/30 dark:border-zinc-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-primary/10 dark:bg-emerald-950/40 p-6 flex flex-col items-center text-center border-b border-outline-variant/20 dark:border-zinc-800">
          <div className="w-14 h-14 rounded-full bg-primary/20 dark:bg-emerald-900/50 flex items-center justify-center mb-3 text-primary dark:text-emerald-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-on-surface dark:text-zinc-100">
            Complete Account Setup
          </h2>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-1 max-w-xs">
            You signed in via Google (<span className="font-semibold text-on-surface dark:text-zinc-300">{user?.email}</span>). Please confirm your details below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-error-container/30 border border-error/20 text-xs text-error font-semibold text-center">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant dark:text-zinc-400 mb-1.5 ml-1">
              Verify Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full pl-9 pr-4 py-2.5 bg-surface dark:bg-zinc-800 border border-outline-variant dark:border-zinc-700 rounded-xl text-sm text-on-surface dark:text-zinc-100 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant dark:text-zinc-400 mb-1.5 ml-1">
              Contact Number <span className="text-error">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                required
                className="w-full pl-9 pr-4 py-2.5 bg-surface dark:bg-zinc-800 border border-outline-variant dark:border-zinc-700 rounded-xl text-sm text-on-surface dark:text-zinc-100 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <p className="text-[11px] text-on-surface-variant/70 dark:text-zinc-500 mt-1 ml-1">
              Required for medicine delivery updates & verification.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant dark:text-zinc-400 mb-1.5 ml-1">
              Set Password <span className="text-error">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="w-full pl-9 pr-10 py-2.5 bg-surface dark:bg-zinc-800 border border-outline-variant dark:border-zinc-700 rounded-xl text-sm text-on-surface dark:text-zinc-100 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-on-surface-variant/70 dark:text-zinc-500 mt-1 ml-1">
              This allows you to sign in with your email & password anytime.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-on-primary rounded-xl font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Details...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Save & Continue
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
