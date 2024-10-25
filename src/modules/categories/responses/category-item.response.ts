import { Expose } from 'class-transformer';
import { Category } from 'src/entities/categories/category.entity';
import { JsonResponse } from 'src/lib/responses/json.response';

export class CategoryItemResponse extends JsonResponse<{}> {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'name' })
  name: string;

  @Expose({ name: 'description' })
  description: string;

  @Expose({ name: 'isRootParent' })
  isRootParent: boolean;

  @Expose({ name: 'children' })
  children: Category[];

  @Expose({ name: 'parent' })
  parent: Category;
}
