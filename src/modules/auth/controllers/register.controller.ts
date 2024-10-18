import { Body, Controller, Post } from '@nestjs/common';
import { Serialize } from 'src/lib/interceptors/serialize.interceptor';
import { ResponseSchema } from 'src/lib/responses/response.type';
import { UserResponseDto } from 'src/modules/users/responses/user-response.dto';
import { RegisterRequestDto } from '../requests/register-request.dto';
import { RegisterVerificationRequest } from '../requests/register-verification.request';
import { RegisterService } from '../services/register.service';

@Controller('auth')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register')
  @Serialize(UserResponseDto)
  async register(@Body() body: RegisterRequestDto) {
    return this.registerService.registerUser(body);
  }

  @Post('verify')
  async verifyRegistration(
    @Body() request: RegisterVerificationRequest,
  ): Promise<ResponseSchema> {
    await this.registerService.verify(request);

    return {};
  }
}
