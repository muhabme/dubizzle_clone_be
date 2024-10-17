import { Module } from '@nestjs/common';
import { ListingsModule } from '../classified-listings/listings.module';
import { UsersModule } from '../users/users.module';
import { FavoritesController } from './Controller/favorites.controller';
import { FavoritesService } from './Service/favorites.service';

@Module({
  imports: [UsersModule, ListingsModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
