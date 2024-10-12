
import { Controller, Post, Get, Delete, Body, Param, Req } from '@nestjs/common';
import { ReviewsService } from '../services/reviews.service';
import { Request } from 'express';
import { User } from 'src/entities/users/user.entity';
import { Listing } from 'src/entities/listing/listings.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async createReview(
    @Req() req: Request,
    @Body() body: { revieweeId?: number; listingId?: number; rating: number; comment: string },
  ) {
    const reviewer: User = req.user as User;
    const reviewData: any = { reviewer, rating: body.rating, comment: body.comment };

    if (body.revieweeId) {
      reviewData.reviewee = new User();
      reviewData.reviewee.id = body.revieweeId;
    }

    if (body.listingId) {
      reviewData.listing = new Listing();
      reviewData.listing.id = body.listingId;
    }

    return await this.reviewsService.createReview(reviewData);
  }

  @Get('user/:userId')
  async getReviewsByUser(@Param('userId') userId: number) {
    return await this.reviewsService.getReviewsByUser(userId);
  }

  @Get('listing/:listingId')
  async getReviewsForListing(@Param('listingId') listingId: number) {
    return await this.reviewsService.getReviewsForListing(listingId);
  }

  @Delete(':reviewId')
  async deleteReview(@Param('reviewId') reviewId: number) {
    return await this.reviewsService.deleteReview(reviewId);
  }
}
