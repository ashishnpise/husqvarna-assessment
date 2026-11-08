import React, { useState, useEffect, useCallback } from 'react';
import { api } from './api/client';
import { FeatureFlag, AuditLog, WebhookDelivery, Environment } from './types';
import { Header } from './components/Header';
import { FlagFilter } from './components/FlagFilter';
import { FlagList } from './components/FlagList';
import { CreateFlagModal } from './components/CreateFlagModal';
import { AuditLogFeed } from './components/AuditLogFeed';
import { WebhookDrawer } from './components/WebhookDrawer';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [webhookDeliveries, setWebhookDeliveries] = useState<WebhookDelivery[]>([]);
  const [currentActor, setCurrentActor] = useState<string>('admin@husqvarna.com');
  const [lastReadWebhookTime, setLastReadWebhookTime] = useState<number>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('last_read_webhook_time') : null;
    return saved ? parseInt(saved, 10) : 0;
  });

  // Filters
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAuditFilterKey, setActiveAuditFilterKey] = useState<string | undefined>(undefined);

  // Modals & Drawers
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isWebhookDrawerOpen, setIsWebhookDrawerOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Loading states
  const [isLoadingFlags, setIsLoadingFlags] = useState(true);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [isLoadingWebhooks, setIsLoadingWebhooks] = useState(false);

  // Sync actor to API client
  const handleActorChange = (actor: string) => {
    setCurrentActor(actor);
    api.setActor(actor);
    showToast(`Switched active actor to: ${actor}`, 'info');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch flags
  const loadFlags = useCallback(async () => {
    try {
      const data = await api.getFlags({
        environment: selectedEnvironment === 'all' ? undefined : selectedEnvironment,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        search: searchQuery || undefined,
      });
      setFlags(data);
    } catch (err: unknown) {
      console.error('Failed to load flags:', err);
    } finally {
      setIsLoadingFlags(false);
    }
  }, [selectedEnvironment, selectedStatus, searchQuery]);

  // Fetch audit logs
  const loadAuditLogs = useCallback(async () => {
    try {
      const data = await api.getAuditLogs(activeAuditFilterKey);
      setAuditLogs(data);
    } catch (err: unknown) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  }, [activeAuditFilterKey]);

  // Fetch webhooks
  const loadWebhooks = useCallback(async () => {
    setIsLoadingWebhooks(true);
    try {
      const data = await api.getRecentWebhooks();
      setWebhookDeliveries(data);
      setLastReadWebhookTime((prev) => {
        if (prev === 0) {
          const now = Date.now();
          if (typeof window !== 'undefined') {
            localStorage.setItem('last_read_webhook_time', now.toString());
          }
          return now;
        }
        return prev;
      });
    } catch (err: unknown) {
      console.error('Failed to load webhooks:', err);
    } finally {
      setIsLoadingWebhooks(false);
    }
  }, []);

  // Webhook read / unread status tracking
  const unreadWebhookCount = webhookDeliveries.filter(
    (d) => lastReadWebhookTime > 0 && new Date(d.deliveredAt).getTime() > lastReadWebhookTime
  ).length;

  const handleMarkAllWebhooksAsRead = useCallback(() => {
    const now = Date.now();
    setLastReadWebhookTime(now);
    if (typeof window !== 'undefined') {
      localStorage.setItem('last_read_webhook_time', now.toString());
    }
  }, []);

  const handleOpenWebhookDrawer = () => {
    setIsWebhookDrawerOpen(true);
    handleMarkAllWebhooksAsRead();
  };

  // Initial load
  useEffect(() => {
    loadFlags();
  }, [loadFlags]);

  useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

  useEffect(() => {
    loadWebhooks();
  }, [loadWebhooks]);

  // Optimistic Toggle Handler
  const handleToggleFlag = async (id: string) => {
    const targetFlag = flags.find((f) => f.id === id);
    if (!targetFlag) return;

    const previousStatus = targetFlag.enabled;
    const nextStatus = !previousStatus;

    // Optimistic UI update
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: nextStatus } : f))
    );

    try {
      const updated = await api.toggleFlag(id);

      // Refresh audit logs and webhooks after toggle
      loadAuditLogs();
      if (updated.environment === 'prod') {
        showToast(
          `Prod flag '${updated.key}' toggled ${updated.enabled ? 'ON' : 'OFF'} (async external webhook dispatched)`,
          'info'
        );
        // Delay 300ms to allow async worker to persist delivery
        setTimeout(loadWebhooks, 300);
      } else {
        showToast(`Flag '${updated.key}' updated successfully.`, 'success');
      }
    } catch (err: unknown) {
      // Rollback on error
      setFlags((prev) =>
        prev.map((f) => (f.id === id ? { ...f, enabled: previousStatus } : f))
      );
      const error = err as Error;
      showToast(error.message || 'Failed to toggle flag.', 'error');
    }
  };

  // Flag Creation
  const handleCreateFlag = async (input: {
    key: string;
    description: string;
    environment: Environment;
    enabled: boolean;
  }) => {
    await api.createFlag(input);
    showToast(`Feature flag '${input.key}' created in ${input.environment}.`, 'success');
    loadFlags();
    loadAuditLogs();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Navigation Header */}
      <Header
        currentActor={currentActor}
        onActorChange={handleActorChange}
        onCreateClick={() => setIsCreateModalOpen(true)}
        onWebhookClick={handleOpenWebhookDrawer}
        webhookCount={webhookDeliveries.length}
        unreadWebhookCount={unreadWebhookCount}
      />

      {/* Floating Notification Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs shadow-xl animate-in slide-in-from-bottom duration-200">
          {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          {toast.type === 'info' && <Info className="h-4 w-4 text-blue-600" />}
          {toast.type === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
          <span className="font-medium text-slate-800">{toast.message}</span>
        </div>
      )}

      {/* Main Content Layout */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Feature Flag Controls & List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <FlagFilter
              selectedEnvironment={selectedEnvironment}
              onEnvironmentChange={setSelectedEnvironment}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              totalCount={flags.length}
              filteredCount={flags.length}
            />

            <FlagList
              flags={flags}
              isLoading={isLoadingFlags}
              onToggle={handleToggleFlag}
              onViewHistory={(key) => setActiveAuditFilterKey(key)}
              onCreateClick={() => setIsCreateModalOpen(true)}
            />
          </div>

          {/* Right Column: Immutable Audit Log Feed (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-20">
              <AuditLogFeed
                logs={auditLogs}
                isLoading={isLoadingLogs}
                activeFilterKey={activeAuditFilterKey}
                onClearFilter={() => setActiveAuditFilterKey(undefined)}
                onRefresh={loadAuditLogs}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Create Flag Modal */}
      <CreateFlagModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateFlag}
      />

      {/* Webhook Activity Drawer */}
      <WebhookDrawer
        isOpen={isWebhookDrawerOpen}
        onClose={() => setIsWebhookDrawerOpen(false)}
        deliveries={webhookDeliveries}
        isLoading={isLoadingWebhooks}
        onRefresh={loadWebhooks}
        unreadCount={unreadWebhookCount}
        onMarkAllAsRead={handleMarkAllWebhooksAsRead}
      />
    </div>
  );
};

export default App;

