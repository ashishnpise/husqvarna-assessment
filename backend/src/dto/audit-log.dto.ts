import { AuditLog } from '../../db/models/AuditLog';

export class AuditLogResponseDto {
  public readonly id: string;
  public readonly flagId: string | null;
  public readonly flagKey: string;
  public readonly environment: string;
  public readonly actor: string;
  public readonly action: string;
  public readonly previousState: Record<string, unknown> | null;
  public readonly newState: Record<string, unknown>;
  public readonly timestamp: string;

  constructor(log: AuditLog) {
    this.id = log.id;
    this.flagId = log.flagId;
    this.flagKey = log.flagKey;
    this.environment = log.environment;
    this.actor = log.actor;
    this.action = log.action;
    this.previousState = log.previousState;
    this.newState = log.newState;
    this.timestamp =
      log.timestamp instanceof Date ? log.timestamp.toISOString() : String(log.timestamp);
  }

  static fromEntity(log: AuditLog): AuditLogResponseDto {
    return new AuditLogResponseDto(log);
  }

  static fromEntities(logs: AuditLog[]): AuditLogResponseDto[] {
    return logs.map((l) => AuditLogResponseDto.fromEntity(l));
  }
}

