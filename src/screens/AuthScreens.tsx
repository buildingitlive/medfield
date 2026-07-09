import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Mail, Lock, Phone } from 'lucide-react';

interface AuthScreenProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const AuthScreens: React.FC<AuthScreenProps> = ({ currentRoute, onNavigate }) => {
  const [email, setEmail] = useState('clinician@sfdispensary.org');
  const [phone, setPhone] = useState('+1 (415) 555-0199');
  const [otp, setOtp] = useState(['4', '8', '2', '9']);

  const handleOtpChange = (index: number, val: string) => {
    const next = [...otp];
    next[index] = val.slice(-1);
    setOtp(next);
  };

  return (
    <main className="min-h-screen bg-surface dark:bg-zinc-950 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        {/* Clean Header with Cropped MedField Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/logo.png"
            alt="MedField Logo"
            className="w-48 sm:w-56 h-auto object-contain mb-3 cursor-pointer"
            onClick={() => onNavigate('/splash')}
          />
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant dark:text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-primary-container" />
            Field-to-Pharmacy Clinical Access
          </span>
        </div>

        {/* Authentication Container with Asymmetric Radius */}
        <div className="bg-surface-container-lowest dark:bg-zinc-900 p-6 sm:p-8 rounded-brand shadow-sm border border-surface-variant dark:border-zinc-800">
          {currentRoute === '/login' && (
            <div>
              <h1 className="font-heading text-2xl font-bold text-on-surface dark:text-zinc-100 mb-1">
                Sign in to your account
              </h1>
              <p className="text-sm text-on-surface-variant dark:text-zinc-400 mb-6">
                Access your dispensary orders, prescriptions, and verified field batches.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-zinc-400 mb-1.5">
                    Email or Professional License ID
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-on-surface-variant" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full min-h-[48px] pl-11 pr-4 rounded-md border border-outline-variant dark:border-zinc-700 bg-surface dark:bg-zinc-800 text-on-surface dark:text-zinc-100 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-zinc-400 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-on-surface-variant" />
                    <input
                      type="password"
                      defaultValue="••••••••••••"
                      className="w-full min-h-[48px] pl-11 pr-4 rounded-md border border-outline-variant dark:border-zinc-700 bg-surface dark:bg-zinc-800 text-on-surface dark:text-zinc-100 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container text-sm"
                    />
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('/otp')}
                  className="w-full min-h-[48px] bg-primary-container hover:bg-primary text-on-primary font-semibold rounded-md flex items-center justify-center gap-2 shadow transition-all mt-6"
                >
                  <span>Continue with 2FA Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-6 text-center text-xs text-on-surface-variant dark:text-zinc-400">
                New clinical facility or dispensary?{' '}
                <button
                  onClick={() => onNavigate('/register')}
                  className="text-primary-container font-semibold hover:underline"
                >
                  Register organization
                </button>
              </div>
            </div>
          )}

          {currentRoute === '/otp' && (
            <div>
              <h1 className="font-heading text-2xl font-bold text-on-surface dark:text-zinc-100 mb-1">
                Enter OTP Verification Code
              </h1>
              <p className="text-sm text-on-surface-variant dark:text-zinc-400 mb-6">
                We sent a 4-digit code to your registered phone {phone}
              </p>

              <div className="grid grid-cols-4 gap-3 mb-6">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-full min-h-[56px] text-center text-xl font-bold rounded-md border border-outline-variant dark:border-zinc-700 bg-surface dark:bg-zinc-800 text-on-surface dark:text-zinc-100 focus:outline-none focus:border-primary-container"
                  />
                ))}
              </div>

              <button
                onClick={() => onNavigate('/')}
                className="w-full min-h-[48px] bg-primary-container hover:bg-primary text-on-primary font-semibold rounded-md flex items-center justify-center gap-2 shadow transition-all"
              >
                <span>Verify & Enter Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-6 text-center text-xs text-on-surface-variant dark:text-zinc-400">
                Didn't receive code?{' '}
                <button
                  onClick={() => onNavigate('/login')}
                  className="text-primary-container font-semibold hover:underline"
                >
                  Resend code
                </button>
              </div>
            </div>
          )}

          {currentRoute === '/register' && (
            <div>
              <h1 className="font-heading text-2xl font-bold text-on-surface dark:text-zinc-100 mb-1">
                Register Clinical Account
              </h1>
              <p className="text-sm text-on-surface-variant dark:text-zinc-400 mb-6">
                Create a verified buyer or pharmacy account to order direct from cultivation fields.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-zinc-400 mb-1">
                    Facility / Dispensary Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Alpine Healthcare Dispensary"
                    className="w-full min-h-[48px] px-3.5 rounded-md border border-outline-variant dark:border-zinc-700 bg-surface dark:bg-zinc-800 text-on-surface dark:text-zinc-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-zinc-400 mb-1">
                    DEA / State License ID
                  </label>
                  <input
                    type="text"
                    defaultValue="PHA-CA-998104"
                    className="w-full min-h-[48px] px-3.5 rounded-md border border-outline-variant dark:border-zinc-700 bg-surface dark:bg-zinc-800 text-on-surface dark:text-zinc-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-zinc-400 mb-1">
                    Direct Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-4 text-on-surface-variant" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full min-h-[48px] pl-10 pr-3.5 rounded-md border border-outline-variant dark:border-zinc-700 bg-surface dark:bg-zinc-800 text-on-surface dark:text-zinc-100 text-sm"
                    />
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('/otp')}
                  className="w-full min-h-[48px] bg-primary-container hover:bg-primary text-on-primary font-semibold rounded-md flex items-center justify-center gap-2 shadow transition-all mt-4"
                >
                  <span>Submit Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 text-center text-xs text-on-surface-variant dark:text-zinc-400">
                Already registered?{' '}
                <button
                  onClick={() => onNavigate('/login')}
                  className="text-primary-container font-semibold hover:underline"
                >
                  Sign in
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Back to Catalog shortcut */}
        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('/')}
            className="text-xs font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            ← Continue as Guest to Field Catalog
          </button>
        </div>
      </div>
    </main>
  );
};
