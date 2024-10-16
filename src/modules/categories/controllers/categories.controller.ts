import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
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

  // @Patch(':id')
  // async updateCategory(
  //   @Param('id') id: string,
  //   @Body() body: { name?: string; description?: string },
  // ) {
  //   const updatedCategory = await this.categoriesService.update(id, body);
  //   return new CategoryItemResponse(updatedCategory).getJson();
  // }

  // @Delete(':id')
  // async deleteCategory(@Param('id') id: string) {
  //   await this.categoriesService.delete(id);
  //   return { message: 'Category deleted successfully.' };
  // }

}
