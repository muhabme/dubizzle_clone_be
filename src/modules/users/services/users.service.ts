import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/users/user.entity';
import { CrudService } from 'src/lib/services/crud.service';
import { DeepPartial } from 'typeorm';

@Injectable()
export class UsersService extends CrudService<User> {
  constructor() {
    super({ entity: User });
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return await this.findOne({ where: { email } });
  }

  public async findByResetToken(resetToken: string): Promise<User | undefined> {
    return await this.findOne({ where: { resetToken } });
  }

  public async createUser(data: DeepPartial<User>): Promise<User> {
    if (
      data.birth_date &&
      !(data.birth_date instanceof Date) &&
      typeof data.birth_date !== 'object'
    ) {
      data.birth_date = new Date(data.birth_date);
    }

    return await this.create(data);
  }
}
