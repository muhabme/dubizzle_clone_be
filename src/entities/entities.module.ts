import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Category } from './categories/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Category])],
})
export class EntitiesModule {}
