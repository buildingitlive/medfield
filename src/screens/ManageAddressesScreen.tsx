import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Loader2, Navigation } from 'lucide-react';
import { useAddresses } from '../hooks/useAddresses';

interface ManageAddressesScreenProps {
  onNavigate?: (route: string) => void;
}

export const ManageAddressesScreen: React.FC<ManageAddressesScreenProps> = () => {
  const { addresses, defaultAddress, loading, addAddress, updateAddress, deleteAddress, setDefault } = useAddresses();
  const defaultAddressId = defaultAddress?.id;
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [newRecipientName, setNewRecipientName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLabel, setNewLabel] = useState('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');
  const [locating, setLocating] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const openAddForm = () => {
    setEditId(null);
    setNewRecipientName('');
    setNewPhone('');
    setNewLabel('Home');
    setNewStreet('');
    setNewCity('');
    setNewState('');
    setNewZip('');
    setCoords(null);
    setError(null);
    setShowForm(true);
  };

  const openEditForm = (addr: any) => {
    setEditId(addr.id);
    setNewRecipientName(addr.recipient_name || '');
    setNewPhone(addr.phone || '');
    setNewLabel(addr.label || 'Home');
    setNewStreet(addr.street || '');
    setNewCity(addr.city || '');
    setNewState(addr.state || '');
    setNewZip(addr.zip || '');
    setCoords(addr.latitude && addr.longitude ? { lat: addr.latitude, lng: addr.longitude } : null);
    setError(null);
    setShowForm(true);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
          );
          const data = await res.json();
          const addr = data.address || {};

          setNewCity(addr.city || addr.town || addr.village || addr.county || '');
          setNewState(addr.state || '');
          setNewZip(addr.postcode || '');
          setCoords({ lat: latitude, lng: longitude });
        } catch {
          alert('Could not fetch address from your location. Please enter manually.');
        } finally {
          setLocating(false);
        }
      },
      () => {
        alert('Location access denied. Please allow location permission and try again.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newState || !newZip) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setError(null);
    
    const payload: any = {
      recipient_name: newRecipientName || 'Customer Address',
      phone: newPhone || '+91 00000 00000',
      label: newLabel,
      street: newStreet,
      city: newCity,
      state: newState,
      zip: newZip,
      latitude: coords?.lat ?? null,
      longitude: coords?.lng ?? null,
    };

    let result;
    if (editId) {
      result = await updateAddress(editId, payload);
    } else {
      result = await addAddress({ ...payload, is_default: false });
    }

    if (result.error) {
      setError(result.error);
      return;
    }

    setShowForm(false);
  };

  return (
    <main className="min-h-screen pb-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-on-surface dark:text-zinc-100 mb-1">
          Your Addresses
        </h1>
        <p className="text-xs text-on-surface-variant dark:text-zinc-400">
          Manage your saved delivery addresses for medicine orders
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : addresses.map((addr) => {
          const isSelected = addr.id === defaultAddressId || addr.is_default;
          return (
            <div
              key={addr.id}
              onClick={() => setDefault(addr.id)}
              className={`p-5 rounded-md border transition-all cursor-pointer bg-surface-container-lowest dark:bg-zinc-900 ${
                isSelected
                  ? 'border-primary border-l-4 shadow-sm'
                  : 'border-surface-variant dark:border-zinc-800 hover:border-outline'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Radio button indicator matching Reference Design */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                    isSelected ? 'border-primary' : 'border-outline-variant'
                  }`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-on-surface dark:text-zinc-100">
                      {addr.recipient_name || 'Customer Address'}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-surface-container dark:bg-zinc-800 text-on-surface-variant'
                      }`}
                    >
                      {addr.label}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {addr.street}
                    <br />
                    {addr.city}, {addr.state} {addr.zip}
                    <br />
                    Phone: {addr.phone || '+91 00000 00000'}
                  </p>

                  {/* Actions matching reference design */}
                  <div className="mt-3 flex items-center gap-4 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditForm(addr);
                      }}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await deleteAddress(addr.id);
                      }}
                      className="inline-flex items-center gap-1 text-error hover:underline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!showForm ? (
        <button
          onClick={() => openAddForm()}
          className="w-full min-h-[48px] border-2 border-primary text-primary font-semibold text-xs rounded-md flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      ) : (
        <form
          onSubmit={handleSave}
          className="bg-surface-container-lowest dark:bg-zinc-900 border border-surface-variant p-5 rounded-brand shadow-sm space-y-4"
        >
          <h2 className="font-heading text-base font-bold text-on-surface dark:text-zinc-100">
            Add New Delivery Address
          </h2>

          {/* Use Current Location */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className="w-full min-h-[44px] border border-primary text-primary font-semibold text-xs rounded-md flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors disabled:opacity-60"
          >
            {locating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            <span>{locating ? 'Detecting location...' : 'Use Current Location'}</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Recipient / Contact Name
              </label>
              <input
                type="text"
                value={newRecipientName}
                onChange={(e) => setNewRecipientName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full min-h-[44px] px-3 rounded border border-outline-variant bg-surface dark:bg-zinc-800 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Location Label
              </label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Home, Work Office"
                className="w-full min-h-[44px] px-3 rounded border border-outline-variant bg-surface dark:bg-zinc-800 text-xs"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full min-h-[44px] px-3 rounded border border-outline-variant bg-surface dark:bg-zinc-800 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                placeholder="B-12, Sector 62"
                className="w-full min-h-[44px] px-3 rounded border border-outline-variant bg-surface dark:bg-zinc-800 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                City
              </label>
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="Noida"
                className="w-full min-h-[44px] px-3 rounded border border-outline-variant bg-surface dark:bg-zinc-800 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  placeholder="Uttar Pradesh"
                  className="w-full min-h-[44px] px-3 rounded border border-outline-variant bg-surface dark:bg-zinc-800 text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={newZip}
                  onChange={(e) => setNewZip(e.target.value)}
                  placeholder="201301"
                  className="w-full min-h-[44px] px-3 rounded border border-outline-variant bg-surface dark:bg-zinc-800 text-xs"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 rounded bg-primary-container text-on-primary text-xs font-semibold shadow"
            >
              Save Address
            </button>
          </div>
        </form>
      )}
    </main>
  );
};
