'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('webhook_deliveries', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      flag_key: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      environment: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      action: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      payload: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      response_status: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      delivered_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });

    await queryInterface.addIndex('webhook_deliveries', ['delivered_at'], {
      name: 'idx_webhook_deliveries_delivered_at',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('webhook_deliveries');
  },
};

