import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ItemResponse, ListResponse } from 'src/lib/responses/response.type';
import { OnlyAdmins } from 'src/modules/auth/passport/guards/only-admins.guard';
import { UpdateCategoryRequest } from '../requests/create-category.request';
import { CategoryItemResponse } from '../responses/category-item.response';
import { ListCategoriesResponse } from '../responses/list-categories.response';
import { AdminCategoriesService } from '../services/categories.service';

@Controller('admin/categories')
@UseGuards(OnlyAdmins)
export class AdminCategoriesController {
  constructor(private categoriesService: AdminCategoriesService) {}

  @Get()
  async findAll() {
    const categories = await this.categoriesService.findWithRelations({
      relations: ['parent', 'children'],
    });

    return new ListCategoriesResponse().json({
      data: categories,
    }) as ListResponse<ListCategoriesResponse>;
  }

  @Post()
  async createCategory(
    @Body()
    body: UpdateCategoryRequest,
  ) {
    const parent = body?.parent
      ? await this.categoriesService.findOne({ where: { uuid: body.parent } })
      : null;

    const category = await this.categoriesService.create({
      ...body,
      parent,
      parent_id: isNaN(parent?.id!) ? null : parent?.id,
      featured_at: body.is_featured ? new Date() : null,
    });

    return new CategoryItemResponse().json({
      data: category.transform(CategoryItemResponse),
    }) as ItemResponse<CategoryItemResponse>;
  }
  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: UpdateCategoryRequest,
  ) {
    const oldCategory = await this.categoriesService.first({ uuid: id });
    if (!oldCategory) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    const parent = body.parent
      ? await this.categoriesService.findOne({ where: { uuid: body.parent } })
      : null;

    if (body.parent && !parent) {
      throw new NotFoundException(
        `Parent category with id ${body.parent} not found`,
      );
    }

    const updatedCategory = await this.categoriesService.update(
      { uuid: id },
      {
        ...body,
        parent,
        parent_id: parent ? parent.id : null,
        ...(!body.is_featured && oldCategory?.featured_at
          ? { featured_at: null }
          : body.is_featured && !oldCategory?.featured_at
            ? { featured_at: new Date() }
            : {}),
      },
    );

    return new CategoryItemResponse().json({
      data: updatedCategory.transform(CategoryItemResponse),
    }) as ItemResponse<CategoryItemResponse>;
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    const category = await this.categoriesService.first(
      { uuid: id },
      { relations: { listings: true } },
    );

    if (category && (category?.listings?.length || 0) > 0) {
      throw new ConflictException(
        'Cannot delete category because it has associated products.',
      );
    }
    const deletedCategory = await this.categoriesService.remove({
      where: { uuid: id },
    });

    return new CategoryItemResponse().json({
      data: deletedCategory.transform(CategoryItemResponse),
    }) as ItemResponse<CategoryItemResponse>;
  }
}
