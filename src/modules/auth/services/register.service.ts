import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from 'src/entities/users/user.entity';
import { FindOptionsWhere } from 'typeorm';
import { UsersService } from '../../users/services/users.service';
import { RegisterRequestDto } from '../requests/register-request.dto';
import { RegisterVerificationRequest } from '../requests/register-verification.request';

@Injectable()
export class RegisterService {
  constructor(private usersService: UsersService) {}

  async registerUser(body: RegisterRequestDto) {
    await this.checkEmailAvailability(body);

    return this.usersService.create(body);
  }
  async checkEmailAvailability({ email }: RegisterRequestDto) {
    const user: User = await this.usersService.findByCondition({
      where: { email },
    });
    if (user) throw new ConflictException('Email already in use');
  }

  async verify(request: RegisterVerificationRequest) {
    const where: FindOptionsWhere<User> = {};

    if (request.email) {
      where.email = request.email;
    }

    // if (request.mobile) {
    //   where.mobile = request.mobile;
    // }

    const user = await User.findOne({ where });

    if (user) {
      throw new HttpException(
        'Credentials already in use',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
