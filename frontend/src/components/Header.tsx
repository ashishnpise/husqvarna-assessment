import React from 'react';
import { Flag, Bell, Plus, User } from 'lucide-react';

interface HeaderProps {
  currentActor: string;
  onActorChange: (actor: string) => void;
  onCreateClick: () => void;
  onWebhookClick: () => void;
  webhookCount: number;
  unreadWebhookCount?: number;
}

const ACTORS = [
  'admin@husqvarna.com',
  'devops-lead@husqvarna.com',
  'release-manager@husqvarna.com',
  'secops-analyst@husqvarna.com',
];

export const Header: React.FC<HeaderProps> = ({
  currentActor,
  onActorChange,
  onCreateClick,
  onWebhookClick,
  webhookCount,
  unreadWebhookCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-900 to-indigo-900 text-white shadow-md shadow-blue-900/20">
            <Flag className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Husqvarna</span>
              <span className="text-xs text-slate-400">/</span>
              <span className="text-xs font-semibold text-slate-500">Fleet Cloud Operations</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              Team Feature Flags & Audit Log
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Actor Selector */}
          <div className="hidden sm:flex items-center space-x-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700">
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-400 font-medium">Actor:</span>
            <select
              value={currentActor}
              onChange={(e) => onActorChange(e.target.value)}
              className="bg-transparent font-medium text-slate-800 outline-none cursor-pointer"
            >
              {ACTORS.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          {/* Webhook Activity Button with Unread Badge */}
          <button
            onClick={onWebhookClick}
            className="relative flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
            title="Inspect external async webhook deliveries"
          >
            <Bell className="h-4 w-4 text-slate-600" />
            <span className="hidden md:inline">Webhooks</span>
            {unreadWebhookCount > 0 ? (
              <span
                className="inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white animate-pulse"
                title={`${unreadWebhookCount} unread webhook notification(s)`}
              >
                {unreadWebhookCount}
              </span>
            ) : webhookCount > 0 ? (
              <span
                className="inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-slate-100 text-slate-500 px-1 text-[10px] font-medium"
                title="All webhook notifications viewed"
              >
                {webhookCount}
              </span>
            ) : null}
          </button>

          {/* Create Flag Button */}
          <button
            onClick={onCreateClick}
            className="flex items-center space-x-1.5 rounded-lg bg-blue-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Flag</span>
          </button>
        </div>
      </div>
    </header>
  );
};

