import type { ValidationError } from '@nestjs/common';
// eslint-disable-next-line custom-rules/validation-pipe-import
import {
  ValidationPipe as BaseValidationPipe,
  Optional,
  UnprocessableEntityException,
  ValidationPipeOptions,
} from '@nestjs/common';
import { camelCase } from 'lodash';

export class ValidationPipe extends BaseValidationPipe {
  constructor(@Optional() options?: ValidationPipeOptions) {
    options = {
      enableDebugMessages: true,
      transform: true,
      // forbidUnknownValues: true,
      whitelist: true,
      ...options,
    };
    super(options);
  }

  public createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      const camelCaseErrors = validationErrors.map((error) =>
        this.formatValidationError(error),
      );

      return new UnprocessableEntityException(camelCaseErrors);
    };
  }

  public formatValidationError(validationError: ValidationError) {
    const { property, constraints: consts, children } = validationError;
    const constraints: Record<string, string> = consts || {};

    // replace property name with camelCase in constraints
    this.handleConstraints(constraints, property);

    this.handleChildren(children, property);

    return {
      property: camelCase(property),
      constraints,
      children,
    };
  }

  private handleConstraints(
    constraints: Record<string, string>,
    property: string,
  ) {
    for (const key in constraints) {
      if (Object.prototype.hasOwnProperty.call(constraints, key)) {
        let message: string | undefined;

        if (['isIn'].includes(key)) {
          message = constraints[key]
            .split('one of the following values: ')[1]
            .split(',')
            .join(', ');
        } else {
          message = constraints[key].replace(property, 'property');
        }

        constraints[key] = message || constraints[key];
      }
    }
  }

  private handleChildren(
    children: ValidationError[] | undefined,
    _property: string,
  ) {
    for (const key in children) {
      if (Object.prototype.hasOwnProperty.call(children, key)) {
        const errors = this.mapChildrenToValidationErrors(
          children[key] as ValidationError,
        );

        children[key] = errors.map((error) =>
          this.formatValidationError(error),
        );
      }
    }
  }

  protected mapChildrenToValidationErrors(
    error: ValidationError,
    parentPath?: string,
  ): ValidationError[] {
    if (!(error.children && error.children.length > 0)) {
      return [error];
    }

    const validationErrors: ValidationError[] = [];

    parentPath = parentPath ? `${parentPath}.${error.property}` : '';

    for (const item of error.children) {
      if (item.children && item.children.length > 0) {
        validationErrors.push(
          ...this.mapChildrenToValidationErrors(item, parentPath),
        );
      }

      validationErrors.push(
        this.prependConstraintsWithParentProp(parentPath, item),
      );
    }

    return validationErrors;
  }
}
