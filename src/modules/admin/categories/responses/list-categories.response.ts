import { Expose, Type } from 'class-transformer';
import { JsonResponse } from 'src/lib/responses/json.response';
import { CategoryItemResponse } from 'src/modules/admin/categories/responses/category-item.response';

export class ListCategoriesResponse extends JsonResponse<{}> {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'name' })
  name: string;

  @Expose({ name: 'description' })
  description: string;

  @Expose({ name: 'isRootParent' })
  isRootParent: boolean;

  @Expose({ name: 'children' })
  @Type(() => ListCategoriesResponse)
  children: ListCategoriesResponse[];

  @Expose({ name: 'parent' })
  @Type(() => CategoryItemResponse)
  parent: CategoryItemResponse;

  @Expose({ name: 'isFeatured' })
  isFeatured: boolean;
}
