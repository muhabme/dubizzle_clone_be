import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from 'src/entities/listing/listings.entity';
import { Promotion } from 'src/entities/listing/promotion.entity';
import { User } from 'src/entities/users/user.entity';
import { CrudService } from '../../../lib/services/crud.service';
import { ListingsService } from '../../classified-listings/service/listings.service';

@Injectable()
export class PromotionsService extends CrudService<Promotion> {
  constructor(
    @InjectRepository(Listing)
    private readonly listingsService: ListingsService,
  ) {
    super(Promotion);
  }

  async promoteListing(
    user: User,
    listing: Listing,
    type: string,
    durationInDays: number,
  ): Promise<Promotion> {
    const existingPromotion = await this.findOne({
      where: { listing, promotionType: type },
    });
    if (existingPromotion) {
      throw new Error('Listing is already promoted.');
    }

    return await this.create({
      listing,
      promotionType: type,
      startDate: new Date(),
      endDate: new Date(Date.now() + durationInDays * 24 * 60 * 60 * 1000),
    });
  }

  async getUserPromotions(userId: number): Promise<Promotion[]> {
    return await this.findAll({
      where: { listing: { owner: { id: userId } } },
      relations: ['listing'],
    });
  }

  async deletePromotion(promotionId: number): Promise<void> {
    const promotion = await this.findOneById({ id: promotionId });
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    await this.remove(promotion);
  }
}
