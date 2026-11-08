'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      flag_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'feature_flags',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      flag_key: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      environment: {
        type: Sequelize.ENUM('dev', 'staging', 'prod'),
        allowNull: false,
      },
      actor: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      action: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      previous_state: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      new_state: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });

    await queryInterface.addIndex('audit_logs', ['timestamp'], {
      name: 'idx_audit_logs_timestamp',
    });
    await queryInterface.addIndex('audit_logs', ['flag_key'], {
      name: 'idx_audit_logs_flag_key',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('audit_logs');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_audit_logs_environment";');
  },
};

