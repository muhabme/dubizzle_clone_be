import { Module } from '@nestjs/common';
import { CategoriesModule } from '../categories/categories.module';
import { MediaCenterModule } from '../media-center/media-center.module';
import { UsersModule } from '../users/users.module';
import { ListingsController } from './controllers/listings.controller';
import { ListingsService } from './service/listings.service';
import { PromotionService } from './service/promotion.service';

@Module({
  imports: [CategoriesModule, UsersModule, MediaCenterModule],
  controllers: [ListingsController],
  providers: [ListingsService, PromotionService],
  exports: [ListingsService],
})
export class ListingsModule {}
