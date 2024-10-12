import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User } from 'src/entities/users/user.entity';
import { CrudService } from 'src/lib/services/crud.service';

@Injectable()
export class UsersService extends CrudService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  public async findByResetToken(resetToken: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { resetToken } });
  }

  public async createUser(data: DeepPartial<User>): Promise<User> {
    if (
      data.birth_date &&
      !(data.birth_date instanceof Date) &&
      typeof data.birth_date !== 'object'
    ) {
      data.birth_date = new Date(data.birth_date);
    }

    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  public async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}
