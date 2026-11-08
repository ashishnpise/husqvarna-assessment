import React from 'react';
import { Flag } from 'lucide-react';
import { FeatureFlag } from '../types';
import { FlagItem } from './FlagItem';

interface FlagListProps {
  flags: FeatureFlag[];
  isLoading: boolean;
  onToggle: (id: string) => Promise<void>;
  onViewHistory: (flagKey: string) => void;
  onCreateClick: () => void;
}

export const FlagList: React.FC<FlagListProps> = ({
  flags,
  isLoading,
  onToggle,
  onViewHistory,
  onCreateClick,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 h-24"
          />
        ))}
      </div>
    );
  }

  if (flags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
          <Flag className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">No feature flags found</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          No feature flags match your active filters, or none have been created yet.
        </p>
        <button
          onClick={onCreateClick}
          className="mt-4 rounded-lg bg-blue-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-800 transition-colors"
        >
          Create First Flag
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {flags.map((flag) => (
        <FlagItem
          key={flag.id}
          flag={flag}
          onToggle={onToggle}
          onViewHistory={onViewHistory}
        />
      ))}
    </div>
  );
};

