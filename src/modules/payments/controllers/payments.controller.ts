import { Controller, Post, Get, Param, Req, Body } from '@nestjs/common';

import { Request } from 'express';
import { PaymentsService } from '../services/payment.service';
import { PromotionsService } from '../services/promotions.service';
import { User } from 'src/entities/users/user.entity';
import { Listing } from 'src/entities/listing/listings.entity';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly promotionsService: PromotionsService,
  ) {}

  @Post()
  async processPayment(@Req() req: Request, @Body() body: { amount: number; provider: string }) {
    const user: User = req.user as User;
    return await this.paymentsService.processPayment(user, body.amount, body.provider);
  }

  @Get()
  async getUserPayments(@Req() req: Request) {
    const user: User = req.user as User;
    return await this.paymentsService.getUserPayments(user.id);
  }

  @Post('promote/:listingId')
  async promoteListing(
    @Req() req: Request,
    @Param('listingId') listingId: number,
    @Body() body: { type: string; durationInDays: number },
  ) {
    const user: User = req.user as User;
    const listing = new Listing(); // Normally, you'd fetch the listing from the database
    listing.id = listingId;

    return await this.promotionsService.promoteListing(user, listing, body.type, body.durationInDays);
  }

  @Get('promotions')
  async getUserPromotions(@Req() req: Request) {
    const user: User = req.user as User;
    return await this.promotionsService.getUserPromotions(user.id);
  }
}
