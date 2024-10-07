import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../services/search.service';
import { SearchListingsDto } from '../dtos/search-listings.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('listings')
  async searchListings(@Query() searchListingsDto: SearchListingsDto) {
    return await this.searchService.searchListings(searchListingsDto);
  }
}
