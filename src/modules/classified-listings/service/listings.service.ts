import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../../../entities/listing/listings.entity';
import { CreateListingDto } from '../dtos/create-listing.dto';

export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingsRepository: Repository<Listing>,
  ) {}

  async createListing(createListingDto: CreateListingDto): Promise<Listing> {
    const listing = this.listingsRepository.create(createListingDto);
    return await this.listingsRepository.save(listing);
  }

  async findAllListings(): Promise<Listing[]> {
    return await this.listingsRepository.find();
  }

  async findOneListing(id: number): Promise<Listing | undefined> {
    return await this.listingsRepository.findOne({ where: { id } });
  }

  async deleteListing(id: number): Promise<void> {
    await this.listingsRepository.delete(id);
  }
}
