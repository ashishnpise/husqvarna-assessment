'use strict';

const { randomUUID } = require('crypto');

const FLAGS_DATA = [
  {
    key: 'new-checkout-flow',
    description: 'Enables redesigned one-step checkout with instant financing',
    environment: 'dev',
    enabled: true,
  },
  {
    key: 'new-checkout-flow',
    description: 'Enables redesigned one-step checkout with instant financing',
    environment: 'staging',
    enabled: true,
  },
  {
    key: 'new-checkout-flow',
    description: 'Enables redesigned one-step checkout with instant financing',
    environment: 'prod',
    enabled: false,
  },
  {
    key: 'ai-mower-pathing-v2',
    description: 'Autonomous robotic lawn mower SLAM pathing optimization',
    environment: 'dev',
    enabled: true,
  },
  {
    key: 'ai-mower-pathing-v2',
    description: 'Autonomous robotic lawn mower SLAM pathing optimization',
    environment: 'prod',
    enabled: false,
  },
  {
    key: 'dark-mode-theme',
    description: 'High-contrast dark mode palette for pro field app',
    environment: 'dev',
    enabled: true,
  },
  {
    key: 'dark-mode-theme',
    description: 'High-contrast dark mode palette for pro field app',
    environment: 'staging',
    enabled: false,
  },
  {
    key: 'battery-telemetry-streaming',
    description: 'High-frequency MQTT telemetry streaming for battery health',
    environment: 'prod',
    enabled: true,
  },
  {
    key: 'fleet-dashboard-analytics',
    description: 'Real-time equipment utilization analytics dashboard',
    environment: 'staging',
    enabled: true,
  },
  {
    key: 'smart-scheduling-engine',
    description: 'Automated weather-aware mowing schedule optimizer',
    environment: 'prod',
    enabled: false,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const existingCount = await queryInterface.rawSelect(
      'feature_flags',
      {},
      ['count']
    );

    if (parseInt(existingCount || '0', 10) > 0) {
      console.log('✓ Seeder: Feature flags already exist. Skipping seed.');
      return;
    }

    const now = new Date();
    const flagsToInsert = [];
    const auditLogsToInsert = [];

    for (const flag of FLAGS_DATA) {
      const flagId = randomUUID();
      flagsToInsert.push({
        id: flagId,
        key: flag.key,
        description: flag.description,
        environment: flag.environment,
        enabled: flag.enabled,
        created_at: now,
        updated_at: now,
      });

      auditLogsToInsert.push({
        id: randomUUID(),
        flag_id: flagId,
        flag_key: flag.key,
        environment: flag.environment,
        actor: 'system-seed@husqvarna.internal',
        action: 'CREATE',
        previous_state: null,
        new_state: JSON.stringify({
          key: flag.key,
          environment: flag.environment,
          enabled: flag.enabled,
          description: flag.description,
        }),
        timestamp: now,
      });
    }

    await queryInterface.bulkInsert('feature_flags', flagsToInsert);
    await queryInterface.bulkInsert('audit_logs', auditLogsToInsert);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('audit_logs', null, {});
    await queryInterface.bulkDelete('feature_flags', null, {});
  },
};

