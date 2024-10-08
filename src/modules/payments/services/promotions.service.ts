import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from 'src/entities/listing/listings.entity';
import { Promotion } from 'src/entities/listing/promotion.entity';
import { User } from 'src/entities/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
  ) {}

  async promoteListing(user: User, listing: Listing, type: string, durationInDays: number): Promise<Promotion> {
    const existingPromotion = await this.promotionRepository.findOne({ where: { user, listing, type } });
    if (existingPromotion) {
      throw new Error('Listing is already promoted.');
    }

    const promotion = this.promotionRepository.create({
      user,
      listing,
      type,
      durationInDays,
    });

    return await this.promotionRepository.save(promotion);
  }

  async getUserPromotions(userId: number): Promise<Promotion[]> {
    return await this.promotionRepository.find({
      where: { user: { id: userId } },
      relations: ['listing'],
    });
  }
}
