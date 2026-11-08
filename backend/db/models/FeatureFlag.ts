import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../connection';

export type Environment = 'dev' | 'staging' | 'prod';

export interface FeatureFlagAttributes {
  id: string;
  key: string;
  description: string | null;
  environment: Environment;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type FeatureFlagCreationAttributes = Optional<
  FeatureFlagAttributes,
  'id' | 'description' | 'enabled' | 'createdAt' | 'updatedAt'
>;

export class FeatureFlag
  extends Model<FeatureFlagAttributes, FeatureFlagCreationAttributes>
  implements FeatureFlagAttributes
{
  declare id: string;
  declare key: string;
  declare description: string | null;
  declare environment: Environment;
  declare enabled: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

FeatureFlag.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    environment: {
      type: DataTypes.ENUM('dev', 'staging', 'prod'),
      allowNull: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'feature_flags',
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['key', 'environment'],
        name: 'unique_key_environment_idx',
      },
      {
        fields: ['environment'],
        name: 'idx_flags_environment',
      },
      {
        fields: ['key'],
        name: 'idx_flags_key',
      },
    ],
  }
);

