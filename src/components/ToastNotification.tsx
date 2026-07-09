import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface ToastNotificationProps {
  message: string | null;
  subtitle?: string;
  onViewCart?: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  subtitle,
  onViewCart,
}) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-24 lg:bottom-8 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="bg-inverse-surface dark:bg-zinc-800 text-inverse-on-surface dark:text-zinc-100 rounded-brand p-4 shadow-xl border border-outline-variant/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold">{message}</p>
            {subtitle && <p className="text-[11px] opacity-85 line-clamp-1">{subtitle}</p>}
          </div>
        </div>

        {onViewCart && (
          <button
            onClick={onViewCart}
            className="flex items-center gap-1 text-xs font-bold text-inverse-primary hover:underline whitespace-nowrap"
          >
            <span>Cart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
