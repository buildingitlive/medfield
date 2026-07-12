import { useState } from 'react';
import { ArrowRight, ShieldCheck, Truck, Banknote, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
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
              disabled={loading}
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
