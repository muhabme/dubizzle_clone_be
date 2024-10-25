import {
  Controller,
  Get,
  NotFoundException,
  Query
} from '@nestjs/common';
import { ListResponse } from 'src/lib/responses/response.type';
import { CategoryItemResponse } from '../responses/category-item.response';
import { ListCategoriesResponse } from '../responses/list-categories.response';
import { CategoriesService } from '../services/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    const categories = await this.categoriesService.findWithRelations({
      relations: ['parent', 'children'],
    });

    return new ListCategoriesResponse().json({
      data: categories,
    }) as ListResponse<ListCategoriesResponse>;
  }

  @Get(':id')
  async findOne(@Query('id') id: string) {
    const category = await this.categoriesService.first(
      { uuid: id },
      {
        relations: ['parent', 'children'],
      },
    );

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return new CategoryItemResponse().json({
      data: category.transform(CategoryItemResponse),
    }) as ListResponse<CategoryItemResponse>;
  }
}
