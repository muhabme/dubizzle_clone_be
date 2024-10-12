import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from 'src/entities/favorite/favorite.entity';
import { UsersModule } from '../users/users.module';
import { ClassifiedListingsModule } from '../classified-listings/listings.module';
import { FavoritesController } from './Controller/favorites.controller';
import { FavoritesService } from './Service/favorites.service';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite]), UsersModule, ClassifiedListingsModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
