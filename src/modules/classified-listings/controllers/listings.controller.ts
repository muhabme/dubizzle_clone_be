import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { ListingsService } from '../service/listings.service';
import { PromotionService } from '../service/promotion.service';
import { CreateListingDto } from '../dtos/create-listing.dto';
import { PromoteListingDto } from '../dtos/promote-listing.dto';

@Controller('listings')
export class ListingsController {
  constructor(
    private readonly listingsService: ListingsService,
    private readonly promotionService: PromotionService,
  ) {}

  @Post()
  async createListing(@Body() createListingDto: CreateListingDto) {
    return await this.listingsService.createListing(createListingDto);
  }

  @Get()
  async findAllListings() {
    return await this.listingsService.findAllListings();
  }

  @Get(':id')
  async findOneListing(@Param('id') id: number) {
    return await this.listingsService.findOneListing(id);
  }

  @Delete(':id')
  async deleteListing(@Param('id') id: number) {
    await this.listingsService.deleteListing(id);
  }

  @Post(':id/promote')
  async promoteListing(@Param('id') id: number, @Body() promoteListingDto: PromoteListingDto) {
    return await this.promotionService.promoteListing(id, promoteListingDto);
  }
}
