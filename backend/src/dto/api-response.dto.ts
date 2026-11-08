export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly message?: string;
  public readonly data?: T;
  public readonly count?: number;
  public readonly error?: ApiErrorPayload;

  constructor(params: {
    success: boolean;
    message?: string;
    data?: T;
    count?: number;
    error?: ApiErrorPayload;
  }) {
    this.success = params.success;
    this.message = params.message;
    this.data = params.data;
    this.count = params.count;
    this.error = params.error;
  }

  static success<T>(data: T, message?: string, count?: number): ApiResponse<T> {
    return new ApiResponse<T>({
      success: true,
      data,
      message,
      count,
    });
  }

  static error<T = never>(code: string, message: string, details?: unknown): ApiResponse<T> {
    return new ApiResponse<T>({
      success: false,
      error: {
        code,
        message,
        details,
      },
    });
  }
}

