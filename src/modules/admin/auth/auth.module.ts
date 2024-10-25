import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtModuleOptions } from 'src/config/jwt-module-options';
import { passportModuleOptions } from 'src/config/passport-module-options';
import { AdminAuthStrategy } from 'src/modules/auth/passport/strategies/admin-auth.strategy';
import { AccessTokenService } from 'src/modules/auth/services/access-token.service';
import { LoginService } from 'src/modules/auth/services/login.service';
import { UsersModule } from 'src/modules/users/users.module';
import { AdminLoginController } from './controllers/login.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule.registerAsync(passportModuleOptions),
    JwtModule.registerAsync(jwtModuleOptions),
  ],
  controllers: [AdminLoginController],
  providers: [LoginService, AccessTokenService, AdminAuthStrategy],
})
export class AdminAuthModule {}
