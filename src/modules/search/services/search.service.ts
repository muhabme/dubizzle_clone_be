// src/modules/search/services/search.service.ts
import { Injectable } from '@nestjs/common';
import { Listing } from 'src/entities/listing/listings.entity';
import { CrudService } from '../../../lib/services/crud.service';
import { SearchListingsDto } from '../dtos/search-listings.dto';

@Injectable()
export class SearchService extends CrudService<Listing> {
  constructor() {
    super(Listing);
  }

  async searchListings(
    searchListingsDto: SearchListingsDto,
  ): Promise<Listing[]> {
    const { keyword, category, minPrice, maxPrice, location, sortByPrice } =
      searchListingsDto;

    const query = this.getRepository().createQueryBuilder('listing');

    if (keyword) {
      query.andWhere(
        'listing.title LIKE :keyword OR listing.description LIKE :keyword',
        { keyword: `%${keyword}%` },
      );
    }

    if (category) {
      query.andWhere('listing.category = :category', { category });
    }

    if (minPrice) {
      query.andWhere('listing.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      query.andWhere('listing.price <= :maxPrice', { maxPrice });
    }

    if (location) {
      query.andWhere('listing.location = :location', { location });
    }

    if (sortByPrice) {
      query.orderBy(
        'listing.price',
        sortByPrice.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    return (await query.getMany()) as Listing[];
  }
}
