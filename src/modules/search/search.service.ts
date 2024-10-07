import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../classified-listings/listings.entity';

/**
 * Service for searching and filtering listings.
 */
@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingsRepository: Repository<Listing>,
  ) {}

  // Search listings based on keywords and filters
  async search(keyword: string, filters: any): Promise<Listing[]> {
    const query = this.listingsRepository.createQueryBuilder('listing');

    if (keyword) {
      query.andWhere('listing.title LIKE :keyword', { keyword: `%${keyword}%` });
    }

    if (filters.category) {
      query.andWhere('listing.category = :category', { category: filters.category });
    }

    // Add other filter conditions as needed (price range, location, etc.)
    return query.getMany();
  }
}
