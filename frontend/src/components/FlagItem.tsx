import React, { useState } from 'react';
import { History, Zap } from 'lucide-react';
import { FeatureFlag } from '../types';
import { ToggleSwitch } from './ToggleSwitch';

interface FlagItemProps {
  flag: FeatureFlag;
  onToggle: (id: string) => Promise<void>;
  onViewHistory: (flagKey: string) => void;
}

const ENV_COLORS = {
  dev: 'bg-blue-50 text-blue-700 border-blue-200',
  staging: 'bg-amber-50 text-amber-700 border-amber-200',
  prod: 'bg-purple-50 text-purple-700 border-purple-200',
};

export const FlagItem: React.FC<FlagItemProps> = ({ flag, onToggle, onViewHistory }) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggle(flag.id);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="group relative rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left Side: Flag info */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center space-x-2.5">
            <span className="font-mono text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
              {flag.key}
            </span>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                ENV_COLORS[flag.environment]
              }`}
            >
              {flag.environment}
            </span>
            {flag.environment === 'prod' && (
              <span
                className="inline-flex items-center space-x-1 rounded bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-orange-700 border border-orange-200"
                title="Toggling this prod flag triggers an asynchronous external webhook notification"
              >
                <Zap className="h-2.5 w-2.5 text-orange-600" />
                <span>Async Webhook</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 line-clamp-2">
            {flag.description || <span className="italic text-slate-400">No description provided</span>}
          </p>

          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            <span>
              Updated: {new Date(flag.updatedAt || flag.createdAt).toLocaleDateString()}
            </span>
            <span>•</span>
            <button
              onClick={() => onViewHistory(flag.key)}
              className="flex items-center space-x-1 text-slate-500 hover:text-blue-900 hover:underline transition-colors"
            >
              <History className="h-3 w-3" />
              <span>Audit Trail</span>
            </button>
          </div>
        </div>

        {/* Right Side: Toggle Switch & Status Pill */}
        <div className="flex items-center justify-between sm:justify-end space-x-4 border-t border-slate-100 sm:border-0 pt-2 sm:pt-0">
          <div className="flex items-center space-x-2">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                flag.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
              }`}
            />
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                flag.enabled ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              {flag.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          <ToggleSwitch
            enabled={flag.enabled}
            onChange={handleToggle}
            isLoading={isToggling}
          />
        </div>
      </div>
    </div>
  );
};

