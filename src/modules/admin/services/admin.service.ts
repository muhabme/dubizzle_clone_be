import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/categories/category.entity';
import { Listing } from 'src/entities/listing/listings.entity';
import { User } from 'src/entities/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async blockUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.isBlocked = true;
    return await this.userRepository.save(user);
  }

  async deleteListing(listingId: number): Promise<void> {
    await this.listingRepository.delete(listingId);
  }

  async manageCategory(categoryId: number, updatedCategoryData: Partial<Category>): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new Error('Category not found');
    }
    Object.assign(category, updatedCategoryData);
    return await this.categoryRepository.save(category);
  }
}
