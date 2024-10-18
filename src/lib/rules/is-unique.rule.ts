import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';
import { isArray } from 'lodash';
import {
  type BaseEntity,
  type FindOptionsWhere,
  In,
  Not,
  type Repository,
} from 'typeorm';

export interface IsUniqueValidationArgs<T> {
  property: string;
  object: T;
  value: string | string[];
}

export interface IsUniqueValidationOptions<T> {
  entity: typeof BaseEntity;
  query?: (args: IsUniqueValidationArgs<T>) => Promise<boolean>;
  column?: string;
  load?: boolean;
  except?: { param?: string; column?: string };
  where?: FindOptionsWhere<unknown> | Array<FindOptionsWhere<unknown>>;
}

/**
 * Validates a value is unique
 */
@ValidatorConstraint({ async: true })
export class IsUniqueValidation<T extends Record<string, any>>
  implements ValidatorConstraintInterface
{
  protected options: IsUniqueValidationOptions<T>;

  constructor(options: IsUniqueValidationOptions<T>) {
    this.options = options;
  }

  /**
   * Validates uniqueness
   * @param value - The value to check
   * @param args - Validation arguments
   * @returns True if unique
   */
  async validate(
    value: string | string[],
    { property, object }: ValidationArguments,
  ): Promise<boolean> {
    return this.getQuery({ property, object: object as T, value });
  }

  async getQuery({ property, object, value }: IsUniqueValidationArgs<T>) {
    if (this.options.query) {
      return this.options.query({ property, object, value });
    }

    const repository = this.getRepository(object);

    const where = this.getWhereOptions(value, property);

    if (this.options.except && object.params) {
      const id = object.params[this.options.except.param ?? 'id'];

      where[this.options.except.column ?? 'uuid'] = Not(id);
    }

    return !(await repository.exist({ where }));
  }

  private getRepository(_object: Record<string, any>): Repository<BaseEntity> {
    return this.options.entity.getRepository();
  }

  private getWhereOptions(
    value: string | string[],
    property: string,
  ): FindOptionsWhere<BaseEntity> | Array<FindOptionsWhere<BaseEntity>> {
    const whereOption = this.options.where;

    const whereValue = isArray(value)
      ? {
          [this.getColumn(property)]: In(
            Array.isArray(value) ? value : [value],
          ),
        }
      : { [this.getColumn(property)]: value };

    return { ...whereValue, ...whereOption } as
      | FindOptionsWhere<BaseEntity>
      | Array<FindOptionsWhere<BaseEntity>>;
  }

  private getColumn(property = 'uuid'): string {
    return this.options.column ?? property;
  }

  /**
   * Error message if not unique
   */
  defaultMessage({ property }: ValidationArguments) {
    return `${property} already exists.`;
  }
}

/**
 * Decorator function for class-validator uniqueness validation
 * @param options - Validation options
 * @returns Decorator function
 */
export function IsUnique<T extends Record<string, any>>(
  options: IsUniqueValidationOptions<T>,
  validationOptions?: ValidationOptions,
) {
  return function (object: T, propertyName: string) {
    /**
     * Registers the decorator metadata
     */
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: new IsUniqueValidation(options),
    });
  };
}
