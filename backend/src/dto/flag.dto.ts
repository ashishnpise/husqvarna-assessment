import { FeatureFlag } from '../../db/models/FeatureFlag';

export class FlagResponseDto {
  public readonly id: string;
  public readonly key: string;
  public readonly description: string | null;
  public readonly environment: string;
  public readonly enabled: boolean;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(flag: FeatureFlag) {
    this.id = flag.id;
    this.key = flag.key;
    this.description = flag.description;
    this.environment = flag.environment;
    this.enabled = flag.enabled;
    this.createdAt =
      flag.createdAt instanceof Date ? flag.createdAt.toISOString() : String(flag.createdAt);
    this.updatedAt =
      flag.updatedAt instanceof Date ? flag.updatedAt.toISOString() : String(flag.updatedAt);
  }

  static fromEntity(flag: FeatureFlag): FlagResponseDto {
    return new FlagResponseDto(flag);
  }

  static fromEntities(flags: FeatureFlag[]): FlagResponseDto[] {
    return flags.map((f) => FlagResponseDto.fromEntity(f));
  }
}

