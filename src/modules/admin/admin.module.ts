import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';
import { User } from 'src/entities/users/user.entity';
import { Listing } from 'src/entities/listing/listings.entity';
import { Category } from 'src/entities/categories/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Listing, Category])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
