import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { ListCategoriesResponse } from '../responses/list-categories.response';
import { CategoryItemResponse } from '../responses/category-item.response';

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
    const category = await this.categoriesService.createCategory(body.name, body.description);
    return new CategoryItemResponse(category).getJson();
  }
}
