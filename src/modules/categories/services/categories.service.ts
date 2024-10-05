import { Injectable } from '@nestjs/common';
import { CrudService } from 'src/lib/services/crud.service';
import { Category } from 'src/entities/categories/category.entity';


@Injectable()
export class CategoriesService extends CrudService<Category> {
  constructor() {
    super(Category);
  }
}
