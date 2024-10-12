import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from '../../../entities/listing/promotion.entity';
import { Listing } from '../../../entities/listing/listings.entity';
import { CrudService } from '../../../lib/services/crud.service';
import { PromoteListingDto } from '../dtos/promote-listing.dto';

@Injectable()
export class PromotionService extends CrudService<Promotion> {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {
    super(Promotion);
  }

  async promoteListing(listingId: number, promoteListingDto: PromoteListingDto): Promise<Promotion> {
    const listing = await this.listingRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new Error('Listing not found');
    }

    const promotion = this.promotionRepository.create({
      listing,
      ...promoteListingDto,
    });

    return await this.promotionRepository.save(promotion);
  }
}
