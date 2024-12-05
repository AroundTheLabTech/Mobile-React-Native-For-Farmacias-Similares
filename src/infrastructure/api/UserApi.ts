import { User, UserRepository } from "../../domain/ports/UserRepository";
import { httpClient } from "../http/httpClient";

export class UserApi implements UserRepository {
  async getUsers(): Promise<User[]> {
    const response = await httpClient.get<User[]>("/users");
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await httpClient.get<User>(`/users/${id}`);
    return response.data;
  }
}
