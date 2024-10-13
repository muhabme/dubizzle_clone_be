import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryItemResponse } from '../responses/category-item.response';
import { ListCategoriesResponse } from '../responses/list-categories.response';
import { CategoriesService } from '../services/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return new ListCategoriesResponse(categories).getJson();
  }

  @Post()
  async createCategory(@Body() body: { name: string; description: string }) {
    const category = await this.categoriesService.create(body);
    return new CategoryItemResponse(category).getJson();
  }
}
