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
    const user = this.create(data);
    return await this.userRepository.save(user);
  }

  public async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  public create(data: DeepPartial<User>): User {
    const userData: DeepPartial<User> = data;

    if (
      userData.birth_date &&
      !(userData.birth_date instanceof Date) &&
      typeof userData.birth_date !== 'object'
    ) {
      userData.birth_date = new Date(userData.birth_date);
    }

    const user = this.userRepository.create(data as User);
    return user;
  }
}
