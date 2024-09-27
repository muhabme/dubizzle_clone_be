import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from './listings.entity';

/**
 * Service for managing listings.
 */
@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingsRepository: Repository<Listing>,
  ) {}

  // Fetch all listings
  async findAll(): Promise<Listing[]> {
    return this.listingsRepository.find();
  }

  // Create a new listing
  async createListing(listingData: Partial<Listing>): Promise<Listing> {
    const listing = this.listingsRepository.create(listingData);
    return this.listingsRepository.save(listing);
  }
}
