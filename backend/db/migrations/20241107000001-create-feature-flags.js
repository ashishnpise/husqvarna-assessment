'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('feature_flags', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      key: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      environment: {
        type: Sequelize.ENUM('dev', 'staging', 'prod'),
        allowNull: false,
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });

    await queryInterface.addIndex('feature_flags', ['key', 'environment'], {
      unique: true,
      name: 'unique_key_environment_idx',
    });

    await queryInterface.addIndex('feature_flags', ['environment'], {
      name: 'idx_flags_environment',
    });
    await queryInterface.addIndex('feature_flags', ['key'], {
      name: 'idx_flags_key',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('feature_flags');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_feature_flags_environment";');
  },
};

