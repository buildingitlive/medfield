import React, { useState } from 'react';
import { ArrowLeft, Save, Loader2, User, Phone, CheckCircle2, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileEditScreenProps {
  onNavigate: (route: string) => void;
}

export const ProfileEditScreen: React.FC<ProfileEditScreenProps> = ({ onNavigate }) => {
  const { user, profile, updateProfile } = useAuth();

  const currentName = profile?.name || user?.user_metadata?.name || '';
  const currentPhone = profile?.phone || user?.user_metadata?.phone || '';

  const [name, setName] = useState(currentName);
  const [phone, setPhone] = useState(currentPhone);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setSaving(true);
    setError(null);
    setSaved(false);

    const { error: updateError } = await updateProfile({
      name: name.trim(),
      phone: phone.trim() || undefined,
    });

    setSaving(false);

    if (updateError) {
      setError(updateError);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (!user) return null;

  return (
    <main className="min-h-screen pb-28 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => onNavigate('/profile')}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface hover:bg-surface-container rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-heading text-xl font-bold text-on-surface dark:text-zinc-100">
          Edit Profile
        </h1>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 rounded-full border-2 border-surface-container flex items-center justify-center bg-primary-container text-on-primary-container font-bold text-4xl overflow-hidden">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={name} className="w-full h-full object-cover" />
          ) : (
            (name || 'U').charAt(0).toUpperCase()
          )}
        </div>
      </div>

      {/* Form */}
      <div className="space-y-5">
        {/* Email (Read-Only) */}
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/70" />
            <input
              type="email"
              value={user.email || 'No email associated'}
              disabled
              className="w-full min-h-[48px] bg-surface-container/50 dark:bg-zinc-800/50 border border-outline-variant/60 dark:border-zinc-700/60 rounded-md pl-10 pr-4 text-sm text-on-surface-variant dark:text-zinc-400 cursor-not-allowed select-all font-medium"
            />
          </div>
          <p className="text-[11px] text-on-surface-variant/70 dark:text-zinc-500 mt-1 ml-1">
            This is the verified email associated with your MedField account and cannot be changed.
          </p>
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="edit-name"
            className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1"
          >
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full min-h-[48px] bg-surface-container-low dark:bg-zinc-800 border border-outline-variant dark:border-zinc-700 rounded-md pl-10 pr-4 text-sm text-on-surface dark:text-zinc-100 focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="edit-phone"
            className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1"
          >
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              id="edit-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="w-full min-h-[48px] bg-surface-container-low dark:bg-zinc-800 border border-outline-variant dark:border-zinc-700 rounded-md pl-10 pr-4 text-sm text-on-surface dark:text-zinc-100 focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-error font-semibold bg-error-container/20 border border-error/20 rounded-md px-4 py-2.5">
            {error}
          </p>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full min-h-[48px] bg-primary hover:bg-primary/90 text-on-primary font-semibold rounded-md flex items-center justify-center gap-2 shadow transition-all disabled:opacity-60 mt-4"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </main>
  );
};
