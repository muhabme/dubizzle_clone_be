import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsController } from './controllers/listings.controller';
import { ListingsService } from './service/listings.service';
import { PromotionService } from './service/promotion.service';
import { Listing } from '../../entities/listing/listings.entity';
import { Promotion } from '../../entities/listing/promotion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Listing, Promotion])],
  controllers: [ListingsController],
  providers: [ListingsService, PromotionService],
})
export class ClassifiedListingsModule {}
