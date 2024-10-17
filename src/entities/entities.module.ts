import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './categories/category.entity';
import { Media } from './media-center/media.entity';
import { User } from './users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Category, Media])],
})
export class EntitiesModule {}
