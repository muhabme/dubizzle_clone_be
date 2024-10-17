import { Injectable } from '@nestjs/common';
import { Category } from 'src/entities/categories/category.entity';
import { CrudService } from 'src/lib/services/crud.service';

@Injectable()
export class CategoriesService extends CrudService<Category> {
  constructor() {
    super(Category);
  }
}
