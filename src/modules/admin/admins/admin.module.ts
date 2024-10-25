import { Module } from '@nestjs/common';
import { UsersModule } from 'src/modules/users/users.module';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { ListingsService } from 'src/modules/classified-listings/service/listings.service';
import { ListingsModule } from 'src/modules/classified-listings/listings.module';
import { CategoriesModule } from 'src/modules/categories/categories.module';

@Module({
  imports: [UsersModule, ListingsModule, CategoriesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminAdminsModule {}
