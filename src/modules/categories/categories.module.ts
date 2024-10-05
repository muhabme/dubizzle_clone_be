import { Module } from '@nestjs/common';

import { EntitiesModule } from 'src/entities/entities.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';


@Module({
  imports: [EntitiesModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
