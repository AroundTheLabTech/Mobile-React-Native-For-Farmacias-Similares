export class ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[] | string | null;

  constructor(success: boolean, message: string, data: T, errors: string[] | string | null) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }
}
