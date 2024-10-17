import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { camelCase, isEmpty, snakeCase } from 'lodash';
import {
  type BaseEntity,
  type FindOptionsWhere
} from 'typeorm';

import { FindOptionsUtil } from 'src/lib/utils/find-options-util';
import { toBoolean } from '../../helpers/boolean';
import type { QueryBuilderFilter } from '../filters';
import { ColumnFilter, NonColumnFilter } from '../filters';

@Injectable()
export class QueryBuilderFiltersParser<T extends BaseEntity> {
  allowedFilters?: QueryBuilderFilter[];

  requestFilters: Record<string, string> = {};

  setOptions({ allowedFilters }: { allowedFilters?: QueryBuilderFilter[] }) {
    this.allowedFilters = allowedFilters;

    return this;
  }

  parse(
    requestFilters: Record<string, string>,
  ): FindOptionsWhere<T> | undefined {
    if (isEmpty(requestFilters)) {
      return;
    }

    this.requestFilters = requestFilters;

    let where: FindOptionsWhere<T> | undefined;

    const filterDictionary = this.createFilterDictionary();

    for (const filterName of this.extractRequestedFilters()) {
      this.ensureFilterNameIsValid(filterName, filterDictionary);

      const keyword = this.extractFilterKeyword(filterName);

      if (this.isKeywordApplicable(keyword)) {
        where = this.applyFilterToQuery(
          filterDictionary[filterName],
          keyword,
          where,
        );
      }
    }

    return where;
  }

  private createFilterDictionary(): Record<string, QueryBuilderFilter> {
    return (
      this.allowedFilters?.reduce(
        (acc, filter) => ({
          ...acc,
          [filter.alias]: filter,
        }),
        {},
      ) || {}
    );
  }

  private extractRequestedFilters(): string[] {
    return Object.keys(this.requestFilters).map((f) => snakeCase(f));
  }

  private ensureFilterNameIsValid(
    filterName: string,
    filterDictionary: Record<string, QueryBuilderFilter>,
  ): void {
    const isFilterNameValid = filterName in filterDictionary;

    if (!isFilterNameValid)
      throw new HttpException(
        'Invalid Filter Query',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
  }

  private extractFilterKeyword(filterName: string): string {
    if (this.requestFilters[filterName]) {
      return this.requestFilters[filterName];
    }

    return this.requestFilters[camelCase(filterName)];
  }

  private isKeywordApplicable(keyword: string): boolean {
    return toBoolean(keyword) || keyword === 'null';
  }

  private applyFilterToQuery(
    filter: QueryBuilderFilter,
    keyword: string,
    where: FindOptionsWhere<T> | undefined,
  ): FindOptionsWhere<T> | undefined {
    const condition = filter.build(keyword);

    if (filter instanceof ColumnFilter) {
      return FindOptionsUtil.mergeWhere(where, {
        [filter.nameOrAlias]: condition,
      }) as FindOptionsWhere<T>;
    }

    if (filter instanceof NonColumnFilter) {
      return FindOptionsUtil.mergeWhere(
        where,
        condition,
      ) as FindOptionsWhere<T>;
    }

    return where;
  }
}
