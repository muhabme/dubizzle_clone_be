import { Injectable } from '@nestjs/common';
import { Category } from 'src/entities/categories/category.entity';
import { User } from 'src/entities/users/user.entity';
import { CategoriesService } from 'src/modules/categories/services/categories.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { ListingsService } from '../../classified-listings/service/listings.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly listingsService: ListingsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  async blockUser(userId: number): Promise<User> {
    const user = await this.usersService.first({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    user.isBlocked = true;
    return await user.save();
  }

  async deleteListing(listingId: number): Promise<void> {
    await this.listingsService.remove({ where: { id: listingId } });
  }

  async manageCategory(
    categoryId: number,
    updatedCategoryData: Partial<Category>,
  ): Promise<Category> {
    const category = await this.categoriesService.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new Error('Category not found');
    }
    Object.assign(category, updatedCategoryData);
    return await category.save();
  }
}
