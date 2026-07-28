import React, { useState, useEffect } from 'react';
import { ArrowRight, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface UpdatePasswordScreenProps {
  onNavigate: (route: string) => void;
}

export const UpdatePasswordScreen: React.FC<UpdatePasswordScreenProps> = ({ onNavigate }) => {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If user arrived here without a hash containing access_token, it means they are just navigating directly.
    // If they have a session, we can let them update it. Otherwise, they should probably be on the login screen.
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      // Supabase automatically logs them in, but we can clear the hash for cleanliness
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          onNavigate('/login');
        }
      });
    }
  }, [onNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      setErrorMsg(error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        onNavigate('/');
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface dark:bg-zinc-950 flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface mb-2">Password Updated!</h2>
        <p className="text-on-surface-variant text-center max-w-sm">
          Your password has been successfully reset. Redirecting you to the home screen...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-zinc-950 flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md bg-surface-container-lowest dark:bg-zinc-900 rounded-brand shadow-sm p-6 sm:p-8 flex flex-col items-center border border-surface-variant dark:border-zinc-800">
        <div className="mb-6 flex items-center justify-center">
          <img src="/logo.png" alt="MedField Logo" className="h-14 object-contain" />
        </div>

        <h1 className="font-heading text-2xl font-bold text-primary dark:text-emerald-400 mb-1 text-center">
          Create New Password
        </h1>
        <p className="text-sm text-on-surface-variant dark:text-zinc-400 mb-6 text-center">
          Enter your new password below to secure your account.
        </p>

        {errorMsg && (
          <div className="w-full mb-4 p-3 rounded-md bg-error-container/30 border border-error/20 text-xs text-error font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                minLength={6}
                className="w-full min-h-[48px] bg-surface-container-low dark:bg-zinc-800 border border-outline-variant dark:border-zinc-700 rounded-md px-4 pr-12 text-sm text-on-surface dark:text-zinc-100 focus:outline-none focus:border-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-on-surface-variant hover:text-on-surface"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[48px] bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-md flex items-center justify-center gap-2 shadow transition-all disabled:opacity-60 mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Update Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
