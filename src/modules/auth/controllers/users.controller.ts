import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../entities/users/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByResetToken(token: string): Promise<User> {
    return this.userRepository.findOne({ where: { resetToken: token } });
  }

  async createUser(data: Partial<User>): Promise<User> {
    return this.userRepository.save(data);
  }

  async saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    await this.userRepository.update({ id }, data);
    return this.findById(id);
  }
}
