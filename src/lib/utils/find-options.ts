import { BaseEntity, FindManyOptions, SelectQueryBuilder } from 'typeorm';

export class FindOptions {
  static buildQuery<T extends BaseEntity>(
    this: typeof BaseEntity,
    findOptions?: FindManyOptions<T>,
  ): SelectQueryBuilder<T> {
    const queryBuilder: SelectQueryBuilder<T> =
      this.createQueryBuilder() as unknown as SelectQueryBuilder<T>;

    if (findOptions) {
      queryBuilder.setFindOptions(findOptions);
    }

    return queryBuilder;
  }
}
