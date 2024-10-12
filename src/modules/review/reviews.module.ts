import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './services/reviews.service';
import { ReviewsController } from './controllers/reviews.controller';
import { EntitiesModule } from '../../entities/entities.module';
import { Review } from 'src/entities/reviews-ratings/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), EntitiesModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
