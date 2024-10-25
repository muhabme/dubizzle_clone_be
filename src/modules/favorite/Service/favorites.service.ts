import { Injectable, NotFoundException } from '@nestjs/common';
import { Favorite } from 'src/entities/favorite/favorite.entity';
import { Listing } from 'src/entities/listing/listings.entity';
import { User } from 'src/entities/users/user.entity';
import { CrudService } from 'src/lib/services/crud.service';

@Injectable()
export class FavoritesService extends CrudService<Favorite> {
  constructor() {
    super({ entity: Favorite });
  }

  async addToFavorites(user: User, listing: Listing): Promise<Favorite> {
    const existingFavorite = await this.findOne({
      where: { user, listing },
    });
    if (existingFavorite) {
      throw new Error('Listing is already in your favorites.');
    }

    return await this.create({ user, listing });
  }

  async getUserFavorites(userId: number): Promise<Favorite[]> {
    return await this.findAll({
      where: { user: { id: userId } },
      relations: ['listing'],
    });
  }

  async removeFromFavorites(userId: number, listingId: number): Promise<void> {
    const favorite = await this.findOne({
      where: { user: { id: userId }, listing: { id: listingId } },
    });
    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.remove(favorite);
  }
}
