import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../src/App';
import { api } from '../src/api/client';
import { FeatureFlag, AuditLog } from '../src/types';

const MOCK_FLAGS: FeatureFlag[] = [
  {
    id: '1',
    key: 'new-checkout-flow',
    description: 'Enables redesigned one-step checkout',
    environment: 'dev',
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    key: 'ai-mower-pathing-v2',
    description: 'Robotic lawn mower SLAM pathing',
    environment: 'prod',
    enabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: '101',
    flagId: '1',
    flagKey: 'new-checkout-flow',
    environment: 'dev',
    actor: 'admin@husqvarna.com',
    action: 'CREATE',
    previousState: null,
    newState: { enabled: true },
    timestamp: new Date().toISOString(),
  },
];

describe('Feature Flags Dashboard Component Test', () => {
  beforeEach(() => {
    vi.spyOn(api, 'getFlags').mockResolvedValue(MOCK_FLAGS);
    vi.spyOn(api, 'getAuditLogs').mockResolvedValue(MOCK_AUDIT_LOGS);
    vi.spyOn(api, 'getRecentWebhooks').mockResolvedValue([]);
  });

  it('renders dashboard with title, filters, and pre-seeded flags', async () => {
    render(<App />);

    expect(screen.getByText('Team Feature Flags & Audit Log')).toBeInTheDocument();
    expect(screen.getByText('Immutable Audit Trail')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('new-checkout-flow')).toBeInTheDocument();
      expect(screen.getByText('ai-mower-pathing-v2')).toBeInTheDocument();
    });
  });

  it('filters flags by environment dropdown', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('new-checkout-flow')).toBeInTheDocument();
    });

    // Select 'prod' filter from dropdown
    const envSelect = screen.getByLabelText(/Env:/i);
    fireEvent.change(envSelect, { target: { value: 'prod' } });

    // Verify api.getFlags was called with environment filter
    await waitFor(() => {
      expect(api.getFlags).toHaveBeenCalledWith(
        expect.objectContaining({ environment: 'prod' })
      );
    });
  });

  it('triggers toggle switch on a feature flag', async () => {
    vi.spyOn(api, 'toggleFlag').mockResolvedValue({
      ...MOCK_FLAGS[0],
      enabled: false,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('new-checkout-flow')).toBeInTheDocument();
    });

    const switches = screen.getAllByRole('switch');
    fireEvent.click(switches[0]);

    await waitFor(() => {
      expect(api.toggleFlag).toHaveBeenCalledWith('1');
    });
  });
});

