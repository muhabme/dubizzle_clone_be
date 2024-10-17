import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from 'src/entities/favorite/favorite.entity';
import { UsersModule } from '../users/users.module';
import { ListingsModule } from '../classified-listings/listings.module';
import { FavoritesController } from './Controller/favorites.controller';
import { FavoritesService } from './Service/favorites.service';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite]), UsersModule, ListingsModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
