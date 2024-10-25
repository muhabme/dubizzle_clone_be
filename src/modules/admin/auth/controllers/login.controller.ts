import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from 'src/lib/decorators/public.decorator';
import { Serialize } from 'src/lib/interceptors/serialize.interceptor';
import { LoginRequestDto } from 'src/modules/auth/requests/login-request.dto';
import { AccessTokenService } from 'src/modules/auth/services/access-token.service';
import { LoginService } from 'src/modules/auth/services/login.service';
import { UserType } from 'src/modules/users/enums/user-type.enum';
import { UserResponseDto } from 'src/modules/users/responses/user-response.dto';

@Controller('admin/auth')
export class AdminLoginController {
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
      UserType.ADMIN,
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + AccessTokenService.getExpiresInMs()),
    });

    return user;
  }

  @Get('whoami')
  async whoAmI(@Req() req: Request) {
    return req.user;
  }
}
