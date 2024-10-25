import { toBoolean } from '@lib/helpers/boolean';
import { NonColumnFilter } from '@lib/query-builder/filters';
import { type FindOptionsWhere, IsNull, Not } from 'typeorm';

import { Listing } from 'src/entities/listing/listings.entity';
export class IsOnSaleFilter extends NonColumnFilter {
  constructor() {
    super('is_on_sale');
  }

  build(value: string): FindOptionsWhere<Listing> {
    if (value === 'false') {
      value = 'false';
    } else {
      value = 'true';
    }

    const isOnSale: boolean = toBoolean(value);

    return {
      price_after_sale: isOnSale ? Not(IsNull()) : IsNull(),
    };
  }
}

export const isOnSaleFilter = () => new IsOnSaleFilter();
