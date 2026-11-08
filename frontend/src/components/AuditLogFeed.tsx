import React from 'react';
import { History, Shield, ArrowRight, X, Clock } from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogFeedProps {
  logs: AuditLog[];
  isLoading: boolean;
  activeFilterKey?: string;
  onClearFilter: () => void;
  onRefresh: () => void;
}

const ACTION_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  CREATE: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Created' },
  TOGGLE_ON: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Toggled ON' },
  TOGGLE_OFF: { bg: 'bg-slate-200', text: 'text-slate-800', label: 'Toggled OFF' },
};

export const AuditLogFeed: React.FC<AuditLogFeedProps> = ({
  logs,
  isLoading,
  activeFilterKey,
  onClearFilter,
  onRefresh,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Immutable Audit Trail</h3>
            <p className="text-[11px] text-slate-400">Recorded directly in PostgreSQL with atomic state guarantees</p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          className="text-[11px] font-medium text-blue-900 hover:underline"
        >
          Refresh
        </button>
      </div>

      {activeFilterKey && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-blue-50 px-3 py-1.5 text-xs text-blue-900 border border-blue-200">
          <span>
            Filtered to: <strong className="font-mono">{activeFilterKey}</strong>
          </span>
          <button
            onClick={onClearFilter}
            className="flex items-center space-x-1 text-blue-700 hover:text-blue-900"
          >
            <X className="h-3.5 w-3.5" />
            <span>Show All</span>
          </button>
        </div>
      )}

      <div className="mt-4 max-h-[600px] overflow-y-auto space-y-3 pr-1">
        {isLoading && logs.length === 0 ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No audit records found.
          </div>
        ) : (
          logs.map((log) => {
            const actionInfo = ACTION_STYLES[log.action] || {
              bg: 'bg-slate-100',
              text: 'text-slate-700',
              label: log.action,
            };

            const prevEnabled = log.previousState?.enabled;
            const newEnabled = log.newState?.enabled;

            return (
              <div
                key={log.id}
                className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs transition-all hover:bg-slate-50 hover:border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${actionInfo.bg} ${actionInfo.text}`}
                    >
                      {actionInfo.label}
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {log.flagKey}
                    </span>
                    <span className="rounded bg-slate-200/80 px-1.5 py-0.2 text-[9px] font-semibold uppercase text-slate-600">
                      {log.environment}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </div>
                </div>

                {/* State Diff */}
                <div className="mt-2 flex items-center space-x-2 rounded bg-white px-2.5 py-1.5 text-[11px] font-mono border border-slate-100">
                  <span className="text-slate-400">State:</span>
                  {log.previousState !== null ? (
                    <div className="flex items-center space-x-1.5">
                      <span className={prevEnabled ? 'text-emerald-600 font-semibold' : 'text-slate-500'}>
                        {prevEnabled ? 'enabled' : 'disabled'}
                      </span>
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                      <span className={newEnabled ? 'text-emerald-600 font-semibold' : 'text-slate-500'}>
                        {newEnabled ? 'enabled' : 'disabled'}
                      </span>
                    </div>
                  ) : (
                    <span className={newEnabled ? 'text-emerald-600 font-semibold' : 'text-slate-500'}>
                      initial ({newEnabled ? 'enabled' : 'disabled'})
                    </span>
                  )}
                </div>

                {/* Actor */}
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Shield className="h-3 w-3 text-slate-400" />
                    <span>Actor: <strong>{log.actor}</strong></span>
                  </span>
                  <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

