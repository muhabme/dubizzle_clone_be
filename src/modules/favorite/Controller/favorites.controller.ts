import { Controller, Post, Delete, Get, Param, Req } from '@nestjs/common';

import { Request } from 'express';
import { FavoritesService } from '../Service/favorites.service';
import { User } from 'src/entities/users/user.entity';
import { Listing } from 'src/entities/listing/listings.entity';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':listingId')
  async addToFavorites(@Req() req: Request, @Param('listingId') listingId: number) {
    const user: User = req.user as User;
    const listing = new Listing(); // Normally, you'd fetch the listing from the database
    listing.id = listingId;

    return await this.favoritesService.addToFavorites(user, listing);
  }

  @Get()
  async getUserFavorites(@Req() req: Request) {
    const user: User = req.user as User;
    return await this.favoritesService.getUserFavorites(user.id);
  }

  @Delete(':listingId')
  async removeFromFavorites(@Req() req: Request, @Param('listingId') listingId: number) {
    const user: User = req.user as User;
    await this.favoritesService.removeFromFavorites(user.id, listingId);
  }
}
