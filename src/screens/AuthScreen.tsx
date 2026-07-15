import { useState } from 'react';
import { ArrowRight, ShieldCheck, Truck, Banknote, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email || !password) return;

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setErrorMsg(error);
    } else {
      onLoginSuccess();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!name || !email || !password) return;

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, name, phone || undefined);
    setLoading(false);

    if (error) {
      setErrorMsg(error);
    } else {
      onLoginSuccess();
    }
  };

  const toggleMode = () => {
    setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN');
    setErrorMsg(null);
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    setGoogleLoading(false);
    if (error) {
      setErrorMsg(error);
    }
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-zinc-950 flex flex-col justify-between">
      {/* Main Form */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md bg-surface-container-lowest dark:bg-zinc-900 rounded-brand shadow-sm p-6 sm:p-8 flex flex-col items-center border border-surface-variant dark:border-zinc-800">
          {/* Logo */}
          <div className="mb-6 flex items-center justify-center">
            <img src="/logo.png" alt="MedField Logo" className="h-14 object-contain" />
          </div>

          <h1 className="font-heading text-2xl font-bold text-primary dark:text-emerald-400 mb-1 text-center">
            {mode === 'LOGIN' ? 'Welcome Back' : 'Create Your Account'}
          </h1>
          <p className="text-sm text-on-surface-variant dark:text-zinc-400 mb-6 text-center">
            {mode === 'LOGIN'
              ? 'Sign in to access your MedField account'
              : 'Join MedField for verified medicine delivery across India'}
          </p>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full min-h-[48px] bg-surface-container-low dark:bg-zinc-800 hover:bg-surface-container dark:hover:bg-zinc-700 border border-outline-variant dark:border-zinc-600 text-on-surface dark:text-zinc-100 font-semibold text-sm rounded-md flex items-center justify-center gap-3 shadow-sm transition-all disabled:opacity-60 mb-5"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>{mode === 'LOGIN' ? 'Continue with Google' : 'Sign up with Google'}</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="w-full flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-outline-variant/50 dark:bg-zinc-700" />
            <span className="text-xs font-semibold text-on-surface-variant dark:text-zinc-500 uppercase tracking-wide">
              or
            </span>
            <div className="flex-1 h-px bg-outline-variant/50 dark:bg-zinc-700" />
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="w-full mb-4 p-3 rounded-md bg-error-container/30 border border-error/20 text-xs text-error font-semibold text-center">
              {errorMsg}
            </div>
          )}

          <form
            onSubmit={mode === 'LOGIN' ? handleLogin : handleRegister}
            className="w-full space-y-4"
          >
            {/* Name (Register only) */}
            {mode === 'REGISTER' && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  required
                  className="w-full min-h-[48px] bg-surface-container-low dark:bg-zinc-800 border border-outline-variant dark:border-zinc-700 rounded-md px-4 text-sm text-on-surface dark:text-zinc-100 focus:outline-none focus:border-primary transition-all"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full min-h-[48px] bg-surface-container-low dark:bg-zinc-800 border border-outline-variant dark:border-zinc-700 rounded-md px-4 text-sm text-on-surface dark:text-zinc-100 focus:outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Phone (Register only) */}
            {mode === 'REGISTER' && (
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1"
                >
                  Phone Number
                </label>
                <div className="relative flex items-center w-full">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 text-on-surface-variant font-semibold border-r border-outline-variant/30">
                    +91
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    required
                    className="w-full min-h-[48px] bg-surface-container-low dark:bg-zinc-800 border border-outline-variant dark:border-zinc-700 rounded-md pl-[60px] pr-4 text-sm text-on-surface dark:text-zinc-100 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'REGISTER' ? 'Min 6 characters' : '••••••••'}
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

              {/* Password strength hint (Register only) */}
              {mode === 'REGISTER' && password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-surface-container-high dark:bg-zinc-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        password.length < 6
                          ? 'w-1/4 bg-error'
                          : password.length < 10
                            ? 'w-2/4 bg-amber-500'
                            : 'w-full bg-primary'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-on-surface-variant">
                    {password.length < 6
                      ? 'Too short'
                      : password.length < 10
                        ? 'Good'
                        : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full min-h-[48px] bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-md flex items-center justify-center gap-2 shadow transition-all disabled:opacity-60 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{mode === 'LOGIN' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <p className="text-xs text-on-surface-variant text-center mt-6">
            {mode === 'LOGIN' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary hover:underline font-semibold"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary hover:underline font-semibold"
                >
                  Sign In
                </button>
              </>
            )}
          </p>

          <p className="text-xs text-on-surface-variant text-center mt-4 max-w-xs">
            By proceeding, you agree to our{' '}
            <a href="#" className="text-primary hover:underline font-semibold">
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:underline font-semibold">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>

      {/* Trust Strip Footer */}
      <footer className="w-full bg-surface-container-low dark:bg-zinc-900 py-6 px-4 border-t border-surface-variant dark:border-zinc-800">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-semibold text-on-surface-variant">
              Genuine Medicines
            </span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-outline-variant" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
              <Truck className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-semibold text-on-surface-variant">
              Same-Day Delivery
            </span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-outline-variant" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
              <Banknote className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-semibold text-on-surface-variant">
              Pay on Delivery
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
