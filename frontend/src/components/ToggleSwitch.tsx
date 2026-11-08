import React from 'react';
import { Loader2 } from 'lucide-react';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  enabled,
  onChange,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled || isLoading}
      onClick={onChange}
      className={`group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 ${
        enabled ? 'bg-emerald-600' : 'bg-slate-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className="sr-only">Toggle feature flag</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      >
        {isLoading && <Loader2 className="h-3 w-3 animate-spin text-slate-500" />}
      </span>
    </button>
  );
};

