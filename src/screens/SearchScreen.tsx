import React from 'react';
import { Construction } from 'lucide-react';

interface SearchScreenProps {
  onNavigate: (route: string) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ onNavigate }) => {
  return (
    <main className="min-h-screen pb-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-on-surface dark:text-zinc-100 mb-1">
          Catalog Search
        </h1>
        <p className="text-xs text-on-surface-variant dark:text-zinc-400">
          Find clinical-grade formulations verified from source to pharmacy.
        </p>
      </div>

      <div className="p-12 mt-12 text-center bg-surface-container-lowest dark:bg-zinc-900 rounded-brand border border-surface-variant flex flex-col items-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Construction className="w-8 h-8 text-primary" />
        </div>
        <p className="text-lg font-heading font-bold text-on-surface mb-2">Upcoming Feature</p>
        <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-6">
          The interactive medicine catalog and search is currently a work in progress. For now, please use the <strong>Prescription Upload</strong> feature to place your orders.
        </p>
        <button
          onClick={() => onNavigate('/place-order')}
          className="min-h-[44px] px-6 rounded-md bg-primary hover:bg-primary-container text-on-primary font-semibold shadow transition-colors"
        >
          Place Order via Prescription
        </button>
      </div>
    </main>
  );
};
