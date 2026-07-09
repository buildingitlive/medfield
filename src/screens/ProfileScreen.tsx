import React from 'react';
import {
  MapPin,
  Receipt,
  FileText,
  Gift,
  HelpCircle,
  Info,
  ChevronRight,
  Edit2,
} from 'lucide-react';

interface ProfileScreenProps {
  onNavigate: (route: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const menuItems = [
    {
      label: 'Saved Addresses',
      icon: MapPin,
      route: '/addresses',
    },
    {
      label: 'Order History',
      icon: Receipt,
      route: '/orders',
    },
    {
      label: 'Saved Prescriptions',
      icon: FileText,
      route: '/prescription-upload',
    },
    {
      label: 'Refer & Earn',
      icon: Gift,
      route: '#',
    },
    {
      label: 'Help & Support',
      icon: HelpCircle,
      route: '#',
    },
    {
      label: 'About MedField',
      icon: Info,
      route: '#',
    },
  ];

  return (
    <main className="min-h-screen pb-28 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Profile Header Card matching Reference Design */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-6 mb-6 shadow-sm flex items-center gap-4 relative">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
            alt="Sarah Jenkins"
            className="w-20 h-20 rounded-full object-cover border-2 border-surface-container"
          />
          <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div>
          <h1 className="font-heading text-xl font-bold text-on-surface dark:text-zinc-100">
            Sarah Jenkins
          </h1>
          <p className="text-xs text-on-surface-variant mb-2.5">+1 (555) 123-4567</p>
          <span className="inline-block px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
            Premium Member
          </span>
        </div>
      </div>

      {/* Menu Rows matching Reference Design */}
      <div className="space-y-3">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => {
                if (item.route !== '#') onNavigate(item.route);
              }}
              className="w-full min-h-[56px] bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-md px-5 py-4 flex items-center justify-between hover:border-primary transition-all shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-surface-container dark:bg-zinc-800 flex items-center justify-center text-primary">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-on-surface dark:text-zinc-100">
                  {item.label}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-on-surface-variant" />
            </button>
          );
        })}
      </div>
    </main>
  );
};
