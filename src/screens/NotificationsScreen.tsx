import React, { useEffect } from 'react';
import { Package, Pill, Gift, Stethoscope, Settings, ArrowLeft, ArrowRight, CheckCheck } from 'lucide-react';

interface NotificationsScreenProps {
  onNavigate?: (route: string) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onNavigate }) => {
  // Auto-scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full pb-24 md:pb-8 pt-4 md:pt-8 md:px-margin-desktop max-w-4xl mx-auto">
      {/* Mobile Header (similar to TopAppBar in HTML, but integrated here) */}
      <div className="md:hidden flex items-center justify-between mb-6 px-4">
        <button 
          onClick={() => onNavigate && onNavigate('/')}
          className="text-on-surface-variant dark:text-zinc-400 hover:bg-surface-container transition-colors p-2 rounded-full active:scale-95 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-heading text-xl text-primary dark:text-primary-fixed-dim font-bold">Notifications</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      <div className="hidden md:flex md:items-center md:justify-between mb-8">
        <h1 className="font-heading text-4xl text-on-surface dark:text-zinc-100 font-extrabold tracking-tight">Notifications</h1>
        <button className="text-sm font-semibold text-primary hover:text-primary-container transition-colors flex items-center gap-2">
          <CheckCheck className="w-4 h-4" /> Mark all as read
        </button>
      </div>
      
      <div className="md:hidden flex justify-end mb-4 px-4">
        <button className="text-sm font-semibold text-primary hover:text-primary-container transition-colors flex items-center gap-1">
          <CheckCheck className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      <div className="px-4 md:px-0">
        {/* Today Group */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-on-surface-variant dark:text-zinc-400 mb-4 px-2 uppercase tracking-wider">Today</h2>
          
          <div className="flex flex-col gap-3">
            {/* Notification 1 */}
            <div className="bg-surface-container-lowest dark:bg-zinc-900 rounded-[8px] rounded-tl-[8px] rounded-bl-[24px] rounded-tr-[8px] rounded-br-[8px] p-4 shadow-sm border border-outline-variant/30 dark:border-zinc-800 flex gap-4 items-start relative hover:bg-surface-container-low dark:hover:bg-zinc-800/80 transition-colors cursor-pointer group">
              <div aria-label="Unread" className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary"></div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                <Package className="w-5 h-5" />
              </div>
              <div className="flex-1 pr-6">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-semibold text-on-surface dark:text-zinc-100">Prescription Shipped</h3>
                  <span className="text-xs font-semibold text-primary">2m ago</span>
                </div>
                <p className="text-sm text-on-surface-variant dark:text-zinc-400 line-clamp-2">Your order #ORD-88392 (Amoxicillin 500mg) has been shipped and is on its way. Track your package in the app.</p>
              </div>
            </div>

            {/* Notification 2 */}
            <div className="bg-surface-container-lowest dark:bg-zinc-900 rounded-[8px] rounded-tl-[8px] rounded-bl-[24px] rounded-tr-[8px] rounded-br-[8px] p-4 shadow-sm border border-outline-variant/30 dark:border-zinc-800 flex gap-4 items-start relative hover:bg-surface-container-low dark:hover:bg-zinc-800/80 transition-colors cursor-pointer group">
              <div aria-label="Unread" className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary"></div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                <Pill className="w-5 h-5" />
              </div>
              <div className="flex-1 pr-6">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-semibold text-on-surface dark:text-zinc-100">Time to Refill</h3>
                  <span className="text-xs font-semibold text-primary">1h ago</span>
                </div>
                <p className="text-sm text-on-surface-variant dark:text-zinc-400 line-clamp-2">You have 5 days left on your Lisinopril prescription. Request a refill now to ensure continuous care.</p>
                <button className="mt-3 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container transition-colors inline-flex items-center gap-2">
                  Refill Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification 3 */}
            <div className="bg-surface-container-lowest dark:bg-zinc-900 rounded-[8px] rounded-tl-[8px] rounded-bl-[24px] rounded-tr-[8px] rounded-br-[8px] p-4 shadow-sm border border-outline-variant/30 dark:border-zinc-800 flex gap-4 items-start relative hover:bg-surface-container-low dark:hover:bg-zinc-800/80 transition-colors cursor-pointer group opacity-80">
              <div className="w-10 h-10 rounded-full bg-surface-container dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 text-on-surface-variant dark:text-zinc-400">
                <Gift className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-semibold text-on-surface dark:text-zinc-100">Health Rewards Update</h3>
                  <span className="text-xs font-semibold text-on-surface-variant dark:text-zinc-500">4h ago</span>
                </div>
                <p className="text-sm text-on-surface-variant dark:text-zinc-400 line-clamp-2">You've earned 50 new Health Points from your recent purchase. Redeem them on your next order.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Earlier Group */}
        <section>
          <h2 className="text-sm font-semibold text-on-surface-variant dark:text-zinc-400 mb-4 px-2 uppercase tracking-wider">Earlier</h2>
          
          <div className="flex flex-col gap-3">
            {/* Notification 4 */}
            <div className="bg-surface-container-lowest dark:bg-zinc-900 rounded-[8px] rounded-tl-[8px] rounded-bl-[24px] rounded-tr-[8px] rounded-br-[8px] p-4 shadow-sm border border-outline-variant/30 dark:border-zinc-800 flex gap-4 items-start relative hover:bg-surface-container-low dark:hover:bg-zinc-800/80 transition-colors cursor-pointer group opacity-80">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-semibold text-on-surface dark:text-zinc-100">Consultation Summary Available</h3>
                  <span className="text-xs font-semibold text-on-surface-variant dark:text-zinc-500">Yesterday</span>
                </div>
                <p className="text-sm text-on-surface-variant dark:text-zinc-400 line-clamp-2">The notes from your tele-consultation with Dr. Sarah Jenkins are now available in your medical records.</p>
              </div>
            </div>

            {/* Notification 5 */}
            <div className="bg-surface-container-lowest dark:bg-zinc-900 rounded-[8px] rounded-tl-[8px] rounded-bl-[24px] rounded-tr-[8px] rounded-br-[8px] p-4 shadow-sm border border-outline-variant/30 dark:border-zinc-800 flex gap-4 items-start relative hover:bg-surface-container-low dark:hover:bg-zinc-800/80 transition-colors cursor-pointer group opacity-80">
              <div className="w-10 h-10 rounded-full bg-surface-container dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 text-on-surface-variant dark:text-zinc-400">
                <Settings className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-semibold text-on-surface dark:text-zinc-100">Privacy Policy Update</h3>
                  <span className="text-xs font-semibold text-on-surface-variant dark:text-zinc-500">Oct 12</span>
                </div>
                <p className="text-sm text-on-surface-variant dark:text-zinc-400 line-clamp-2">We've updated our privacy policy to better protect your health data in compliance with new regulations.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
