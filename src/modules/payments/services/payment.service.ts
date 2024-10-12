import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payments/payment.entity';
import { User } from 'src/entities/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async processPayment(user: User, amount: number, provider: string): Promise<Payment> {
    // For demonstration purposes. Here, you'd normally integrate with a payment gateway like Stripe
    const payment = this.paymentRepository.create({
      user,
      amount,
      provider,
      status: 'Completed',
    });

    return await this.paymentRepository.save(payment);
  }

  async getUserPayments(userId: number): Promise<Payment[]> {
    return await this.paymentRepository.find({ where: { user: { id: userId } } });
  }
}
