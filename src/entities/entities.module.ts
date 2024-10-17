import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessToken } from './access-token/access-token.entity';
import { Category } from './categories/category.entity';
import { Favorite } from './favorite/favorite.entity';
import { Listing } from './listing/listings.entity';
import { Promotion as ListingPromotion } from './listing/promotion.entity';
import { Media } from './media-center/media.entity';
import { Conversation } from './messaging/conversation.entity';
import { Message } from './messaging/message.entity';
import { Notification } from './notification/notification.entity';
import { Payment } from './payments/payment.entity';
import { Promotion as PaymentPromotion } from './payments/promotion.entity';
import { Review } from './reviews-ratings/review.entity';
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      AccessToken,
      Category,
      Media,
      Listing,
      ListingPromotion,
      PaymentPromotion,
      Review,
      Payment,
      Notification,
      Favorite,
      Conversation,
      Message,
    ]),
  ],
})
export class EntitiesModule {}
