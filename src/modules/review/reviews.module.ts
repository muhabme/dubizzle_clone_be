import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './services/reviews.service';
import { ReviewsController } from './controllers/reviews.controller';
import { UsersModule } from '../users/users.module';
import { Review } from 'src/entities/reviews-ratings/review.entity';
import { ClassifiedListingsModule } from '../classified-listings/listings.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), UsersModule, ClassifiedListingsModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
