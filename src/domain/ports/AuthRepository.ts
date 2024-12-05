import { ApiResponse } from '@domain/models/ApiResponse';
import { UserAuth } from '@domain/models/User';

export interface AuthRepository {
  postAuth(email: string, password: string): Promise<ApiResponse<UserAuth>>;
}
