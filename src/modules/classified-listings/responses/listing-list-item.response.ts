import { Expose } from 'class-transformer';
import { JsonResponse } from 'src/lib/responses/json.response';

export class ListListingsResponse extends JsonResponse<{}> {
  @Expose({ name: 'uuid' })
  id: string;

  @Expose({ name: 'title' })
  title: string;

  @Expose({ name: 'description' })
  description: string;

  @Expose({ name: 'price' })
  price: number;

  @Expose({ name: 'price_after_sale' })
  priceAfterSale: number;

  @Expose({ name: 'featured_at' })
  featuredAt: Date;

  @Expose({ name: 'images' })
  images: any;

  @Expose({ name: 'created_at' })
  createdAt: any;
}
