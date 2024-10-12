import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from 'src/entities/listing/promotion.entity';
import { CrudService } from '../../../lib/services/crud.service';
import { User } from 'src/entities/users/user.entity';
import { Listing } from 'src/entities/listing/listings.entity';

@Injectable()
export class PromotionsService extends CrudService<Promotion> {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {
    super(promotionRepository);
  }

  async promoteListing(user: User, listing: Listing, type: string, durationInDays: number): Promise<Promotion> {
    const existingPromotion = await this.promotionRepository.findOne({ where: { listing, promotionType: type } });
    if (existingPromotion) {
      throw new Error('Listing is already promoted.');
    }

    const promotion = this.promotionRepository.create({
      listing,
      promotionType: type,
      startDate: new Date(),
      endDate: new Date(Date.now() + durationInDays * 24 * 60 * 60 * 1000),
    });

    return await this.promotionRepository.save(promotion);
  }

  async getUserPromotions(userId: number): Promise<Promotion[]> {
    return await this.promotionRepository.find({
      where: { listing: { owner: { id: userId } } },
      relations: ['listing'],
    });
  }

  async deletePromotion(promotionId: number): Promise<void> {
    const promotion = await this.promotionRepository.findOne({ where: { id: promotionId } });
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    await this.promotionRepository.delete(promotionId);
  }
}