import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';
import { camelCase, snakeCase } from 'lodash';
import {
  type BaseEntity,
  type FindOptionsWhere,
  In,
  type Repository,
} from 'typeorm';

import { Media } from 'src/entities/media-center/media.entity';
import { toBoolean } from '../helpers/boolean';

export interface IsMediaFileValidationArgs {
  property: string;
  object: Record<string, any>;
  value: string | string[];
}

export interface IsMediaFileValidationOptions {
  entity?: typeof BaseEntity;
  query?: (
    args: IsMediaFileValidationArgs,
  ) => Promise<BaseEntity | BaseEntity[] | null>;
  column?: string;
  where?: FindOptionsWhere<unknown> | Array<FindOptionsWhere<unknown>>;
  required?: boolean;
  update?: {
    model: typeof BaseEntity;
    urlParam?: string;
  };
}

/**
 * Validates a value is exists
 */
@ValidatorConstraint({ async: true })
export class IsMediaFileValidation implements ValidatorConstraintInterface {
  protected options: IsMediaFileValidationOptions;

  constructor(options?: IsMediaFileValidationOptions) {
    let defaultWhere: Record<string, unknown> = { uploaded_at: null };

    // if update, capture even the uploaded media
    if (options?.update) {
      defaultWhere = {};
    }

    this.options = {
      entity: Media,
      where: defaultWhere,
      required: options?.required ?? true,
      ...options,
    };
  }

  async validate(
    value: string | string[],
    { property, object }: ValidationArguments,
  ): Promise<boolean> {
    if (!toBoolean(value) && !this.options.required) {
      return true;
    }

    const media = (await this.getQuery({
      property,
      object: object,
      value,
    })) as Media | Media[] | null;

    let isOK = toBoolean(media);

    if (this.options.update && media) {
      isOK = await this.validateUploadedMedia(object, media, property);
    }

    return isOK;
  }

  private async validateUploadedMedia(
    object: Record<string, any>,
    media: Media | Media[],
    property: string,
  ): Promise<boolean> {
    const { model, urlParam } = this.options.update!;

    const uploadedMedia = (Array.isArray(media) ? media : [media]).filter(
      (m) => m.uploaded_at as Date | null,
    );

    if (!toBoolean(uploadedMedia)) {
      return true;
    }

    const uploadedMediaUuids = uploadedMedia.map((m) => m.uuid);

    const repository = model.getRepository();

    const where = { uuid: object.params![urlParam ?? 'id'] };

    const e = await repository.findOneBy(where as FindOptionsWhere<BaseEntity>);

    if (!e) {
      return false;
    }

    const entityProperty = e[snakeCase(property)];

    const uuidRegex = /[\dA-Fa-f]{8}(?:-[\dA-Fa-f]{4}){3}-[\dA-Fa-f]{12}/g;

    const entityPropertyMediaUuids: string[] = entityProperty.map((m) => {
      const key = typeof m === 'string' ? m : m.key;
      const matches = key.match(uuidRegex);

      return matches && matches.length > 0 ? matches[0] : null;
    });

    return uploadedMediaUuids.every((uuid) =>
      entityPropertyMediaUuids.includes(uuid),
    );
  }

  async getQuery({
    property,
    object,
    value,
  }: IsMediaFileValidationArgs): Promise<BaseEntity | BaseEntity[] | null> {
    if (this.options.query) {
      return this.options.query({ property, object, value });
    }

    const where = this.getWhereOptions(value);

    return this.loadEntity({ property, object, value }, where);
  }

  private getRepository(_object: Record<string, any>): Repository<BaseEntity> {
    return this.options.entity!.getRepository();
  }

  private async loadEntity(
    { property, object, value }: IsMediaFileValidationArgs,
    where: FindOptionsWhere<BaseEntity> | Array<FindOptionsWhere<BaseEntity>>,
  ): Promise<BaseEntity | BaseEntity[] | null> {
    const repository = this.getRepository(object);

    const e = Array.isArray(value)
      ? await repository.findBy(where)
      : await repository.findOneBy(where);

    if (e) {
      this.assignInstance(object, property, e);
    }

    return e;
  }

  private assignInstance(
    object: Record<string, any>,
    property: string,
    e?: BaseEntity | BaseEntity[],
  ) {
    if (object.instances === undefined) {
      object.instances = {};
    }

    object.instances = { ...object.instances, [camelCase(property)]: e };
  }

  private getWhereOptions(
    value: string | string[],
  ): FindOptionsWhere<BaseEntity> | Array<FindOptionsWhere<BaseEntity>> {
    const whereOption = this.options.where;

    const whereValue = Array.isArray(value)
      ? { [this.getColumn()]: In(value) }
      : { [this.getColumn()]: value };

    return { ...whereValue, ...whereOption } as
      | FindOptionsWhere<BaseEntity>
      | Array<FindOptionsWhere<BaseEntity>>;
  }

  private getColumn(property = 'uuid'): string {
    return this.options.column ?? property;
  }

  /**
   * Error message if not exists
   */
  defaultMessage({ property }: ValidationArguments) {
    return `property: "${property}" doesn't exist.`;
  }
}

export function IsMediaFile(
  options?: IsMediaFileValidationOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: new IsMediaFileValidation(options),
    });
  };
}
