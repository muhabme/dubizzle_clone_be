import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

/**
 * Service for managing listing categories.
 */
@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async createCategory(name: string, description: string): Promise<Category> {
    const category = this.categoryRepository.create({ name, description });
    return this.categoryRepository.save(category);
  }
}
