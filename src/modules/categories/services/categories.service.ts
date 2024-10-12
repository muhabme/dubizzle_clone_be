import { Injectable } from '@nestjs/common';
import { CrudService } from 'src/lib/services/crud.service';
import { Category } from 'src/entities/categories/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService extends CrudService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
    super(categoryRepository);
  }

  async createCategory(name: string, description: string): Promise<Category> {
    const newCategory = this.categoryRepository.create({ name, description });
    return await this.categoryRepository.save(newCategory);
  }
}
