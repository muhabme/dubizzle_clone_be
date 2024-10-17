import type { FindOperator, FindOptionsWhere } from 'typeorm';

import { QueryBuilderFilter } from './base.filter';

export abstract class ColumnFilter extends QueryBuilderFilter {
  constructor(
    protected columns: string | string[],
    nameOrAlias?: string,
  ) {
    const alias =
      nameOrAlias ?? (Array.isArray(columns) ? columns.join('_') : columns);

    super(alias);
    this.columns = columns;
  }

  abstract build(
    value: unknown,
  ):
    | string
    | FindOperator<unknown>
    | FindOptionsWhere<unknown>
    | Array<Record<string, FindOperator<string>>>;
}
