import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { ListCategoriesResponse } from '../categories/responses/list-categories.response';
import { CategoryItemResponse } from '../categories/responses/category-item.response';
import { Category } from 'src/entities/categories/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return new ListCategoriesResponse().json({ data: categories });
  }

  @Post()
  async createCategory(@Body() body: { name: string; description: string }) {
    const category = await this.categoriesService.createCategory(body.name, body.description);
    return new CategoryItemResponse().json(category);
  }
}
