import { Injectable } from '@nestjs/common';
import { Promotion } from '../../../entities/listing/promotion.entity';
import { CrudService } from '../../../lib/services/crud.service';
import { PromoteListingDto } from '../dtos/promote-listing.dto';
import { ListingsService } from './listings.service';

@Injectable()
export class PromotionService extends CrudService<Promotion> {
  constructor(private readonly listingsService: ListingsService) {
    super(Promotion);
  }

  async promoteListing(
    listingId: number,
    promoteListingDto: PromoteListingDto,
  ): Promise<Promotion> {
    const listing = await this.listingsService.findOne({
      where: { id: listingId },
    });
    if (!listing) {
      throw new Error('Listing not found');
    }

    return await this.create({
      listing,
      ...promoteListingDto,
    });
  }
}
