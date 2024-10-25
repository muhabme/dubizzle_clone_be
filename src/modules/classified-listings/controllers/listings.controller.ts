import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query
} from '@nestjs/common';
import { User } from 'src/entities/users/user.entity';
import { CurrentUser } from 'src/lib/decorators/user.decorator';
import { ListQueryParams } from 'src/lib/query-builder/requests/list-query.params';
import { ItemResponse, ListResponse } from 'src/lib/responses/response.type';
import { CreateListingDto } from '../dtos/create-listing.dto';
import { ListingItemResponse } from '../responses/listing-item.response';
import { ListListingsResponse } from '../responses/listing-list-item.response';
import { ListingsService } from '../service/listings.service';
import { PromotionService } from '../service/promotion.service';

@Controller('listings')
export class ListingsController {
  constructor(
    private readonly listingsService: ListingsService,
    private readonly promotionService: PromotionService,
  ) {}

  @Get()
  async list(@Query() paginateQuery: ListQueryParams) {
    const listings = await this.listingsService.paginate(paginateQuery);

    const res = new ListListingsResponse().json(
      listings,
    ) as ListResponse<ListListingsResponse>;

    return res;
  }

  @Get(':id')
  async show(@Param('id') id: string) {
    const listing = await this.listingsService.first(
      { uuid: id },
      { relations: { category: true } },
    );

    if (!listing) throw new NotFoundException('Listing not found');

    return new ListingItemResponse().json({
      data: listing.transform(ListingItemResponse),
    }) as ItemResponse<ListingItemResponse>;
  }

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createListingDto: CreateListingDto,
  ) {
    return await this.listingsService.createListing(createListingDto, user);
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
