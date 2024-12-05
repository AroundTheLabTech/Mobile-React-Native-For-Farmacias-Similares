import { ApiResponse } from '@domain/models/ApiResponse';
import { UserAuth } from '@domain/models/User';
import { AuthApi } from '@infrastructure/api/AuthApi';

export class PostAuthUseCase {
  private authApi: AuthApi;

  constructor(authApi: AuthApi) {
    this.authApi = authApi;
  }

  async execute(email: string, password: string): Promise<ApiResponse<UserAuth>> {
    const response = await this.authApi.postAuth(email, password);
    return response;
  }
}
