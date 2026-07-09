import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: 'Upload or search',
      description:
        'Easily find your medications by searching our catalog or uploading your prescription.',
      imageUrl:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Clinical Field Direct',
      description:
        'Every pharmaceutical formulation is directly traced from certified growers and labs to your door.',
      imageUrl:
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Verified Cold-Chain Delivery',
      description:
        'Temperature-controlled dispatch ensures maximum assay potency upon arrival.',
      imageUrl:
        'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const current = slides[step];

  const nextStep = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <main className="min-h-screen bg-surface dark:bg-zinc-950 flex flex-col justify-between p-6 max-w-md mx-auto relative">
      {/* Top Skip Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onComplete}
          className="text-sm font-semibold text-primary hover:underline px-2 py-1"
        >
          Skip
        </button>
      </div>

      {/* Hero Illustration Circular Full-Bleed matching Reference Design */}
      <div className="flex-1 flex flex-col items-center justify-center my-6">
        <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden shadow-lg border-4 border-surface-container-low dark:border-zinc-800 mb-8 bg-surface-container">
          <img
            src={current.imageUrl}
            alt={current.title}
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface dark:text-zinc-100 text-center mb-3">
          {current.title}
        </h1>
        <p className="text-sm text-on-surface-variant dark:text-zinc-400 text-center max-w-xs leading-relaxed">
          {current.description}
        </p>
      </div>

      {/* Dots and Continue Button */}
      <div className="space-y-6 pb-4">
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all ${
                i === step ? 'w-6 bg-primary' : 'w-2 bg-surface-container-highest dark:bg-zinc-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextStep}
          className="w-full min-h-[52px] bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-md flex items-center justify-center gap-2 shadow-md transition-all text-sm"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
};
