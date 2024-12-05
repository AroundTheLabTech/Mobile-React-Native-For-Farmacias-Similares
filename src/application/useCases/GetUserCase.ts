import { UserRepository } from '@domain/ports/UserRepository';

export class GetUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute() {
    return this.userRepository.getUsers();
  }
}
