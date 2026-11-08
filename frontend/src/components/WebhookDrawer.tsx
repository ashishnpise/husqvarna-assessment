import React from 'react';
import { X, Bell, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { WebhookDelivery } from '../types';

interface WebhookDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  deliveries: WebhookDelivery[];
  isLoading: boolean;
  onRefresh: () => void;
  unreadCount?: number;
  onMarkAllAsRead?: () => void;
}

export const WebhookDrawer: React.FC<WebhookDrawerProps> = ({
  isOpen,
  onClose,
  deliveries,
  isLoading,
  onRefresh,
  unreadCount = 0,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">External Webhook Telemetry</h2>
              <p className="text-[11px] text-slate-500">
                Simulated async notifications triggered on <strong>prod</strong> flag toggles
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onRefresh}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              title="Refresh webhook activity"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Read / Unread Status Bar */}
        {deliveries.length > 0 && (
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-2.5 text-xs">
            <span className="text-slate-600 text-[11px] flex items-center space-x-1.5">
              {unreadCount > 0 ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="font-semibold text-orange-700">
                    {unreadCount} unread webhook notification{unreadCount > 1 ? 's' : ''}
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="font-medium text-emerald-700">All notifications marked as read</span>
                </>
              )}
            </span>
            {unreadCount > 0 && onMarkAllAsRead && (
              <button
                onClick={onMarkAllAsRead}
                className="text-[11px] font-semibold text-blue-900 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        )}

        {/* Deliveries list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {deliveries.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              <Bell className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No Webhook Deliveries Yet</p>
              <p className="mt-1 max-w-xs mx-auto">
                Toggle any flag in the <strong>prod</strong> environment to watch an async webhook notification appear here automatically.
              </p>
            </div>
          ) : (
            deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-2 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {delivery.status === 'DELIVERED' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    )}
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {delivery.flagKey}
                    </span>
                    <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-purple-700">
                      {delivery.environment}
                    </span>
                  </div>

                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${delivery.status === 'DELIVERED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                  >
                    HTTP {delivery.responseStatus || 200} OK
                  </span>
                </div>

                {/* Payload JSON */}
                <div className="rounded-lg bg-slate-900 p-2.5 text-[11px] font-mono text-slate-200 overflow-x-auto">
                  <pre>{JSON.stringify(delivery.payload, null, 2)}</pre>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Action: <strong>{delivery.action}</strong></span>
                  <span>{new Date(delivery.deliveredAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

