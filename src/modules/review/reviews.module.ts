import { Module } from '@nestjs/common';
import { EntitiesModule } from '../../entities/entities.module';
import { ReviewsController } from './controllers/reviews.controller';
import { ReviewsService } from './services/reviews.service';

@Module({
  imports: [EntitiesModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
