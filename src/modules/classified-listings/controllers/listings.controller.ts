import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ListQueryParams } from 'src/lib/query-builder/requests/list-query.params';
import { CreateListingDto } from '../dtos/create-listing.dto';
import { ListingsService } from '../service/listings.service';
import { PromotionService } from '../service/promotion.service';

@Controller('listings')
export class ListingsController {
  constructor(
    private readonly listingsService: ListingsService,
    private readonly promotionService: PromotionService,
  ) {}

  @Get()
  async list(@Query() query: ListQueryParams) {
    return await this.listingsService.paginate(query);
  }

  @Get(':id')
  async show(@Param('id') id: number) {
    return await this.listingsService.first({ id });
  }

  @Post()
  async create(@Body() createListingDto: CreateListingDto) {
    return await this.listingsService.createListing(createListingDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.listingsService.remove({ where: { id } });
  }

  // @Post(':id/promote')
  // async promoteListing(
  //   @Param('id') id: number,
  //   @Body() promoteListingDto: PromoteListingDto,
  // ) {
  //   return await this.promotionService.promoteListing(id, promoteListingDto);
  // }
}
