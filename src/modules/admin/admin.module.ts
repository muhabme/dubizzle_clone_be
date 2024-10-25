import { Module } from '@nestjs/common';
import { AdminAdminsModule } from './admins/admin.module';
import { AdminAuthModule } from './auth/auth.module';
import { AdminCategoriesModule } from './categories/categories.module';

@Module({
  imports: [AdminAdminsModule, AdminAuthModule, AdminCategoriesModule],
  controllers: [],
  providers: [],
})
export class AdminModule {}
