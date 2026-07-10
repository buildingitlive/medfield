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
  LogOut,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileScreenProps {
  onNavigate: (route: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const { profile, signOut } = useAuth();
  
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

  const handleLogout = async () => {
    await signOut();
    onNavigate('/login');
  };

  if (!profile) return null;

  return (
    <main className="min-h-screen pb-28 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Profile Header Card */}
      <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant dark:border-zinc-800 rounded-brand p-6 mb-6 shadow-sm flex items-center gap-4 relative">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-2 border-surface-container flex items-center justify-center bg-primary-container text-on-primary-container font-bold text-3xl overflow-hidden">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              profile.name.charAt(0).toUpperCase()
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow hover:scale-105 transition-transform">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div>
          <h1 className="font-heading text-xl font-bold text-on-surface dark:text-zinc-100">
            {profile.name}
          </h1>
          {profile.phone && (
            <p className="text-xs text-on-surface-variant mb-2.5">{profile.phone}</p>
          )}
          <span className="inline-block px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold capitalize mt-1">
            {profile.member_tier} Member
          </span>
        </div>
      </div>

      {/* Menu Rows */}
      <div className="space-y-3">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={`menu-${idx}`}
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

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 min-h-[56px] bg-error-container/20 dark:bg-error-container/10 border border-error/20 rounded-md px-5 py-4 flex items-center justify-between hover:bg-error-container/30 transition-all shadow-sm"
        >
          <div className="flex items-center gap-4 text-error">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-error-container/50">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm">
              Log Out
            </span>
          </div>
        </button>
      </div>
    </main>
  );
};
