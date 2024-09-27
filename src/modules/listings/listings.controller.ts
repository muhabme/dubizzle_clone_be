import { Controller, Get, Post, Body } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { Listing } from './listings.entity';

/**
 * Controller for managing listings.
 */
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  findAll(): Promise<Listing[]> {
    return this.listingsService.findAll();
  }

  @Post()
  create(@Body() listingData: Partial<Listing>): Promise<Listing> {
    return this.listingsService.createListing(listingData);
  }
}
