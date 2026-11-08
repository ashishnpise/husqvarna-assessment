export type Environment = 'dev' | 'staging' | 'prod';

export interface FeatureFlag {
  id: string;
  key: string;
  description: string | null;
  environment: Environment;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  flagId: string | null;
  flagKey: string;
  environment: Environment;
  actor: string;
  action: 'CREATE' | 'TOGGLE_ON' | 'TOGGLE_OFF' | string;
  previousState: Record<string, unknown> | null;
  newState: Record<string, unknown>;
  timestamp: string;
}

export interface WebhookDelivery {
  id: string;
  flagKey: string;
  environment: string;
  action: string;
  payload: Record<string, unknown>;
  status: 'DELIVERED' | 'FAILED';
  responseStatus: number | null;
  deliveredAt: string;
}

export interface CreateFlagInput {
  key: string;
  description?: string;
  environment: Environment;
  enabled?: boolean;
}

