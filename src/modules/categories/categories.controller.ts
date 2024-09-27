import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoriesService } from './categories.service';

/**
 * Controller for managing category-related endpoints.
 */
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  createCategory(@Body() body: { name: string; description: string }) {
    return this.categoriesService.createCategory(body.name, body.description);
  }
}
