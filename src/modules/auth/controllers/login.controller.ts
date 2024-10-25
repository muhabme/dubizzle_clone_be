import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/lib/decorators/public.decorator';
import { Serialize } from 'src/lib/interceptors/serialize.interceptor';
import { UserType } from 'src/modules/users/enums/user-type.enum';
import { UserResponseDto } from 'src/modules/users/responses/user-response.dto';
import { LoginRequestDto } from '../requests/login-request.dto';
import { AccessTokenService } from '../services/access-token.service';
import { LoginService } from '../services/login.service';

@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Public()
  @Post('login')
  @Serialize(UserResponseDto)
  async login(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.loginService.attemptLogin(
      body,
      UserType.USER,
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + AccessTokenService.getExpiresInMs()),
    });

    return user;
  }
}
