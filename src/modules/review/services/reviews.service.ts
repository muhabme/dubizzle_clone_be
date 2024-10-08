import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from 'src/entities/listing/listings.entity';
import { Review } from 'src/entities/reviews-ratings/review.entity';
import { User } from 'src/entities/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async createReview(data: {
    reviewer: User;
    reviewee?: User;
    listing?: Listing;
    rating: number;
    comment: string;
  }): Promise<Review> {
    const review = this.reviewRepository.create({
      ...data,
    });

    return await this.reviewRepository.save(review);
  }

  async getReviewsByUser(userId: number): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: [{ reviewer: { id: userId } }, { reviewee: { id: userId } }],
      relations: ['reviewer', 'reviewee', 'listing'],
    });
  }

  async getReviewsForListing(listingId: number): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { listing: { id: listingId } },
      relations: ['reviewer', 'listing'],
    });
  }

  async deleteReview(reviewId: number): Promise<void> {
    const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.reviewRepository.delete(reviewId);
  }
}
