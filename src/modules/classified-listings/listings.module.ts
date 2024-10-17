import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsController } from './controllers/listings.controller';
import { ListingsService } from './service/listings.service';
import { PromotionService } from './service/promotion.service';
import { Listing } from '../../entities/listing/listings.entity';
import { Promotion } from '../../entities/listing/promotion.entity';
import { Category } from '../../entities/categories/category.entity';
import { User } from '../../entities/users/user.entity';
import { CategoriesService } from '../categories/services/categories.service';
import { CategoriesModule } from '../categories/categories.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Listing, Promotion, Category, User]),CategoriesModule,UsersModule],
  controllers: [ListingsController],
  providers: [ListingsService, PromotionService],
  exports: [ListingsService],
})
export class ListingsModule {}
