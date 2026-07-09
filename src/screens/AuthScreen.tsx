import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Truck, Banknote } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setStep('OTP');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-zinc-950 flex flex-col justify-between">
      {/* Main Form Content Canvas */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md bg-surface-container-lowest dark:bg-zinc-900 rounded-brand shadow-sm p-6 sm:p-8 flex flex-col items-center border border-surface-variant dark:border-zinc-800">
          {/* Cropped MedField Logo */}
          <div className="mb-6 flex items-center justify-center">
            <img src="/logo.png" alt="MedField Logo" className="h-14 object-contain" />
          </div>

          <h1 className="font-heading text-2xl font-bold text-primary dark:text-emerald-400 mb-1 text-center">
            Welcome to MedField
          </h1>
          <p className="text-sm text-on-surface-variant dark:text-zinc-400 mb-8 text-center">
            {step === 'PHONE'
              ? 'Enter your mobile number to get started'
              : `Enter the 6-digit OTP sent to +1 ${phone}`}
          </p>

          {step === 'PHONE' ? (
            <form onSubmit={handleSendOtp} className="w-full space-y-6">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1"
                >
                  Mobile Number
                </label>
                <div className="relative flex items-center w-full">
                  <span className="absolute left-3.5 text-sm font-semibold text-on-surface-variant select-none">
                    +1
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    required
                    className="w-full min-h-[48px] bg-surface-container-low dark:bg-zinc-800 border border-outline-variant dark:border-zinc-700 rounded-md pl-11 pr-4 text-sm text-on-surface dark:text-zinc-100 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-md flex items-center justify-center gap-2 shadow transition-all"
              >
                <span>Send OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="w-full space-y-6">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1"
                >
                  One-Time Passcode (OTP)
                </label>
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  required
                  className="w-full min-h-[48px] bg-surface-container-low dark:bg-zinc-800 border border-outline-variant dark:border-zinc-700 rounded-md px-4 text-center tracking-widest font-mono text-lg text-on-surface dark:text-zinc-100 focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm rounded-md flex items-center justify-center gap-2 shadow transition-all"
              >
                <span>Verify & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('PHONE')}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Change Mobile Number
                </button>
              </div>
            </form>
          )}

          <p className="text-xs text-on-surface-variant text-center mt-6 max-w-xs">
            By proceeding, you agree to our{' '}
            <a href="#" className="text-primary hover:underline font-semibold">
              Terms &amp; Conditions
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:underline font-semibold">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>

      {/* Trust Strip Footer matching Reference Design */}
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
