import { HttpException, HttpStatus } from '@nestjs/common';
import type { FindOperator } from 'typeorm';
import { Between } from 'typeorm';
import { ColumnFilter } from './column.filter';

export class PriceRangeFilter extends ColumnFilter {
  /**
   * Builds the price range filter based on the input value.
   * It creates a BETWEEN condition for the specified column.
   *
   * @param {string} value - The value representing the price range in the format min:max.
   * @returns {FindOperator<number>} A price range condition for the specified column.
   */
  build(value: string): FindOperator<number> {
    // Validate the input format for price range
    if (!/^(\d+(\.\d+)?|):(\d+(\.\d+)?|)$/.test(value)) {
      throw new HttpException(
        'Invalid Price Range',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const [min, max] = value.split(':').map(Number); // Convert string values to numbers

    if (min > max) {
      throw new HttpException(
        'Min price cannot be greater than max price',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return Between<number>(min, max);
  }
}

/**
 * Factory function to create a new instance of the PriceRangeFilter class.
 *
 * @param {string} column - Column to be included in the price range filter.
 * @param {string} [alias] - Optional table alias for the column.
 * @returns {PriceRangeFilter} An instance of PriceRangeFilter.
 */
export function priceRangeFilter(
  column: string,
  alias?: string,
): PriceRangeFilter {
  return new PriceRangeFilter(column, alias);
}
