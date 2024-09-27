import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

/**
 * Controller for managing search requests.
 */
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(@Query('keyword') keyword: string, @Query() filters: any) {
    return this.searchService.search(keyword, filters);
  }
}
