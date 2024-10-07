import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from '../../../entities/listing/promotion.entity';
import { Listing } from '../../../entities/listing/listings.entity';
import { PromoteListingDto } from '../dtos/promote-listing.dto';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async promoteListing(listingId: number, promoteListingDto: PromoteListingDto): Promise<Promotion> {
    const listing = await this.listingRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new Error('Listing not found');
    }

    const promotion = this.promotionRepository.create({
      listing,
      ...promoteListingDto,
    });

    listing.promoted = true;
    await this.listingRepository.save(listing);

    return await this.promotionRepository.save(promotion);
  }
}
