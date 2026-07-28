import React from 'react';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

interface NotFoundScreenProps {
  onNavigate: (route: string) => void;
}

export const NotFoundScreen: React.FC<NotFoundScreenProps> = ({ onNavigate }) => {
  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center pb-20">
      <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center mb-6 shadow-sm">
        <FileQuestion className="w-12 h-12 text-primary" />
      </div>
      <h1 className="font-heading text-4xl font-bold text-on-surface dark:text-zinc-100 mb-3 tracking-tight">
        Page Not Found
      </h1>
      <p className="text-sm text-on-surface-variant dark:text-zinc-400 mb-8 max-w-sm">
        Oops! We couldn't find the page you were looking for. It might have been moved or doesn't exist.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none justify-center">
        <button
          onClick={() => onNavigate('BACK')}
          className="flex-1 sm:flex-none min-h-[44px] px-6 border border-outline-variant hover:border-primary text-on-surface dark:text-zinc-100 font-semibold text-sm rounded-md flex items-center justify-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
        <button
          onClick={() => onNavigate('/')}
          className="flex-1 sm:flex-none min-h-[44px] px-6 bg-primary hover:bg-primary/90 text-on-primary font-semibold text-sm rounded-md shadow flex items-center justify-center gap-2 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Home Page</span>
        </button>
      </div>
    </main>
  );
};
