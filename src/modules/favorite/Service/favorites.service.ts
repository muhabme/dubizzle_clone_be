import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from 'src/entities/favorite/favorite.entity';
import { Listing } from 'src/entities/listing/listings.entity';
import { User } from 'src/entities/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async addToFavorites(user: User, listing: Listing): Promise<Favorite> {
    const existingFavorite = await this.favoriteRepository.findOne({ where: { user, listing } });
    if (existingFavorite) {
      throw new Error('Listing is already in your favorites.');
    }

    const favorite = this.favoriteRepository.create({ user, listing });
    return await this.favoriteRepository.save(favorite);
  }

  async getUserFavorites(userId: number): Promise<Favorite[]> {
    return await this.favoriteRepository.find({
      where: { user: { id: userId } },
      relations: ['listing'],
    });
  }

  async removeFromFavorites(userId: number, listingId: number): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { user: { id: userId }, listing: { id: listingId } },
    });
    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.favoriteRepository.remove(favorite);
  }
}
