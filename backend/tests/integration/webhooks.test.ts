import request from 'supertest';
import { createApp } from '../../src/app';

const app = createApp();

describe('Webhook & Async Notification Integration Tests', () => {
  it('should accept incoming external webhook at /api/mock/webhook', async () => {
    const payload = {
      event: 'flag.toggled',
      flagKey: 'test-webhook-flag',
      environment: 'prod',
      actor: 'release-lead@husqvarna.com',
      action: 'TOGGLE_ON',
      previousState: { enabled: false },
      newState: { enabled: true },
      timestamp: new Date().toISOString(),
    };

    const res = await request(app)
      .post('/api/mock/webhook')
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.received).toBe(true);
    expect(res.body.data.service).toBe('MockExternalWebhookReceiver');
  });

  it('should list recent deliveries via inspector endpoint', async () => {
    const res = await request(app).get('/api/mock/webhook/recent');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
