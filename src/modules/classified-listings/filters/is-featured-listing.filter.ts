import { toBoolean } from '@lib/helpers/boolean';
import { NonColumnFilter } from '@lib/query-builder/filters';
import { type FindOptionsWhere, IsNull, Not } from 'typeorm';

import { Listing } from 'src/entities/listing/listings.entity';
export class IsFeaturedListingFilter extends NonColumnFilter {
  constructor() {
    super('is_featured');
  }

  build(value: string): FindOptionsWhere<Listing> {
    if (value === 'false') {
      value = 'false';
    } else {
      value = 'true';
    }

    const isFeatured: boolean = toBoolean(value);

    return {
      featured_at: isFeatured ? Not(IsNull()) : IsNull(),
    };
  }
}

export const isFeaturedListingFilter = () => new IsFeaturedListingFilter();
