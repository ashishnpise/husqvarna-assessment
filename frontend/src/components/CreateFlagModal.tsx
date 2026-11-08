import React, { useState } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { Environment } from '../types';

interface CreateFlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: {
    key: string;
    description: string;
    environment: Environment;
    enabled: boolean;
  }) => Promise<void>;
}

export const CreateFlagModal: React.FC<CreateFlagModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [environment, setEnvironment] = useState<Environment>('dev');
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateKey = (value: string): boolean => {
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedKey = key.trim().toLowerCase();
    if (!trimmedKey) {
      setError('Flag key is required.');
      return;
    }

    if (!validateKey(trimmedKey)) {
      setError('Key must be lowercase alphanumeric with hyphens (e.g. new-checkout-flow).');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        key: trimmedKey,
        description: description.trim(),
        environment,
        enabled,
      });
      // Reset form on success
      setKey('');
      setDescription('');
      setEnvironment('dev');
      setEnabled(false);
      onClose();
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Failed to create feature flag.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Create New Feature Flag</h2>
            <p className="text-xs text-slate-500">Add a new flag to the system with audit tracking</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start space-x-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Key Input */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Flag Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value.toLowerCase())}
              placeholder="e.g. autonomous-mower-v3"
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 font-mono text-xs text-slate-900 placeholder-slate-400 focus:border-blue-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-900"
              autoFocus
              required
            />
            <p className="text-[11px] text-slate-400">
              Must be unique within the selected environment (lowercase letters, numbers, hyphens).
            </p>
          </div>

          {/* Environment Selector Dropdown */}
          <div className="space-y-1">
            <label htmlFor="create-flag-env-select" className="block text-xs font-semibold text-slate-700">
              Target Environment <span className="text-red-500">*</span>
            </label>
            <select
              id="create-flag-env-select"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as Environment)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-900 focus:border-blue-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-900 cursor-pointer"
            >
              <option value="dev">DEV (Development)</option>
              <option value="staging">STAGING (Pre-production)</option>
              <option value="prod">PROD (Production - Triggers Async Webhook)</option>
            </select>
            {environment === 'prod' && (
              <p className="text-[11px] text-orange-600 font-medium">
                ⚡ Prod flag toggles will trigger an asynchronous external webhook notification.
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the feature purpose, owner, or release milestone..."
              rows={3}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-900 resize-none"
            />
          </div>

          {/* Initial Status */}
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div>
              <span className="text-xs font-semibold text-slate-800">Initial State</span>
              <p className="text-[11px] text-slate-500">Enable this feature flag immediately upon creation</p>
            </div>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900 cursor-pointer"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-1.5 rounded-lg bg-blue-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{isSubmitting ? 'Creating...' : 'Create Flag'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

