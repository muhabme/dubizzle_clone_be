import { Module } from '@nestjs/common';

import { AdminCategoriesController } from './controllers/categories.controller';
import { AdminCategoriesService } from './services/categories.service';

@Module({
  controllers: [AdminCategoriesController],
  providers: [AdminCategoriesService],
  exports: [AdminCategoriesService],
})
export class AdminCategoriesModule {}
