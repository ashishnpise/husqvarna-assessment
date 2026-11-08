import { FeatureFlag, AuditLog, WebhookDelivery, CreateFlagInput, Environment } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class ApiClient {
  private actor: string = 'admin@husqvarna.com';

  public setActor(actor: string) {
    this.actor = actor;
  }

  public getActor(): string {
    return this.actor;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'x-actor': this.actor,
      ...(options.headers || {}),
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      let errorMsg = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error?.message) {
          errorMsg = errorData.error.message;
        }
      } catch {
        // fallback to status code message
      }
      throw new Error(errorMsg);
    }

    return response.json();
  }

  async getFlags(filter: { environment?: Environment; status?: string; search?: string } = {}): Promise<FeatureFlag[]> {
    const params = new URLSearchParams();
    if (filter.environment) params.append('environment', filter.environment);
    if (filter.status) params.append('status', filter.status);
    if (filter.search) params.append('search', filter.search);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await this.request<{ data: FeatureFlag[] }>(`/api/flags${query}`);
    return res.data;
  }

  async createFlag(input: CreateFlagInput): Promise<FeatureFlag> {
    const res = await this.request<{ data: FeatureFlag }>('/api/flags', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return res.data;
  }

  async toggleFlag(id: string): Promise<FeatureFlag> {
    const res = await this.request<{ data: FeatureFlag }>(`/api/flags/${id}/toggle`, {
      method: 'PATCH',
    });
    return res.data;
  }

  async getAuditLogs(flagKey?: string): Promise<AuditLog[]> {
    const query = flagKey ? `?flagKey=${encodeURIComponent(flagKey)}` : '';
    const res = await this.request<{ data: AuditLog[] }>(`/api/audit-logs${query}`);
    return res.data;
  }

  async getRecentWebhooks(): Promise<WebhookDelivery[]> {
    const res = await this.request<{ data: WebhookDelivery[] }>('/api/mock/webhook/recent');
    return res.data;
  }
}

export const api = new ApiClient();

