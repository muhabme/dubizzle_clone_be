import { Injectable, NotFoundException } from '@nestjs/common';
import { Listing } from 'src/entities/listing/listings.entity';
import { Review } from 'src/entities/reviews-ratings/review.entity';
import { User } from 'src/entities/users/user.entity';
import { CrudService } from '../../../lib/services/crud.service';

@Injectable()
export class ReviewsService extends CrudService<Review> {
  constructor() {
    super(Review);
  }

  async createReview(data: {
    reviewer: User;
    reviewee?: User;
    listing?: Listing;
    rating: number;
    comment: string;
  }): Promise<Review> {
    return await this.create({
      ...data,
    });
  }

  async getReviewsByUser(userId: number): Promise<Review[]> {
    return await this.findAll({
      where: [{ reviewer: { id: userId } }, { reviewee: { id: userId } }],
      relations: ['reviewer', 'reviewee', 'listing'],
    });
  }

  async getReviewsForListing(listingId: number): Promise<Review[]> {
    return await this.findAll({
      where: { listing: { id: listingId } },
      relations: ['reviewer', 'listing'],
    });
  }

  async deleteReview(reviewId: number): Promise<void> {
    const review = await this.first({ id: reviewId });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.remove(review);
  }
}
