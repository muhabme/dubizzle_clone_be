import { HttpException, HttpStatus } from '@nestjs/common';
import { merge, toNumber } from 'lodash';
import {
  BaseEntity,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  SaveOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { toBoolean } from '../helpers/boolean';
import { ItemQueryBuilder } from '../query-builder/item-query-builder';
import { ListQueryBuilder } from '../query-builder/list-query-builder';
import { ItemQueryParams } from '../query-builder/requests/item-query.params';
import { ListQueryParams } from '../query-builder/requests/list-query.params';
import { FindOptions } from '../utils/find-options';
import { FindOptionsUtil } from '../utils/find-options-util';
import { ModelCollection } from '../utils/model-collection.entity';

export interface RemoveOptions {
  except: { values: unknown[]; key?: string };
}

export interface UpdateOptions {
  except: { values: unknown[]; key?: string };
}

export interface DefaultValues<T = any> {
  findOptions?: FindManyOptions<T> | FindOneOptions<T>;
  attributes?: DeepPartial<T>;
}

export interface CurdServiceOptions<T extends BaseEntity> {
  entity: typeof BaseEntity;
  listQueryBuilder?: ListQueryBuilder<T>;
  itemQueryBuilder?: ItemQueryBuilder<T>;
  removeOptions?: RemoveOptions;
  updateOptions?: UpdateOptions;
  defaults?: DefaultValues<T>;
}

export abstract class CrudService<T extends BaseEntity> {
  protected model?: T | null;

  protected entity: typeof BaseEntity;

  protected itemQueryBuilder?: ItemQueryBuilder<T>;

  protected listQueryBuilder?: ListQueryBuilder<T>;

  protected removeOptions?: RemoveOptions;

  protected updateOptions?: UpdateOptions;

  protected findOptions?: FindManyOptions<T> | FindOneOptions<T>;

  protected defaultAttributes?: DeepPartial<T>;

  protected constructor(options: CurdServiceOptions<T>) {
    this.entity = options.entity;
    this.listQueryBuilder = options.listQueryBuilder;
    this.itemQueryBuilder = options.itemQueryBuilder;

    this.removeOptions = options.removeOptions;
    this.updateOptions = options.updateOptions;
    this.findOptions = options.defaults?.findOptions;
    this.defaultAttributes = options.defaults?.attributes;
  }

  async paginate(params?: ListQueryParams, options?: FindManyOptions<T>) {
    const p = this.listQueryBuilder?.parseParams(params);

    const pWhere = p?.where as Array<FindOptionsWhere<T>>;
    const optionsWhere = options?.where as Array<FindOptionsWhere<T>>;

    if (Array.isArray(pWhere) && Array.isArray(optionsWhere)) {
      const mergedWhere = this.cartesianMerge(pWhere, optionsWhere);
      options!.where = mergedWhere;
      delete p?.where;
    }

    options = this.getFindOptions(FindOptionsUtil.merge(options, p)) ?? {};

    const [items, total] = await this.findAndCount(options);

    return new ModelCollection(items, {
      total,
      currentPage: toNumber(params?.page) || 1,
      eachPage: toNumber(options.take ?? 15),
      lastPage: Math.ceil(total / toNumber(options.take ?? 15)),
    });
  }

  async create(
    attributes: DeepPartial<T>,
    saveOptions?: SaveOptions,
  ): Promise<T>;

  async create(
    items: Array<DeepPartial<T>>,
    saveOptions?: SaveOptions,
  ): Promise<T[]>;

  async create(
    attributes: DeepPartial<T> | Array<DeepPartial<T>>,
    saveOptions?: SaveOptions,
  ): Promise<T | T[]> {
    attributes = this.getAttributes(attributes);

    if (Array.isArray(attributes)) {
      const e = this.getRepository().create(
        attributes as Array<DeepPartial<BaseEntity>>,
      ) as unknown as T[];

      for await (const item of e) {
        await item.save();
      }

      return e;
    }

    const e = this.getRepository().create(
      attributes as DeepPartial<BaseEntity>,
    ) as unknown as T;

    return e.save(saveOptions);
  }

  async findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
    return this.getEntity().buildQuery(options).getManyAndCount();
  }

  async findOne(options?: FindOneOptions<T>): Promise<T> {
    return (await this.getRepository().findOne(
      options as FindOneOptions<BaseEntity>,
    )) as unknown as Promise<T>;
  }

  async first(
    where: FindOptionsWhere<T>,
    options: FindOneOptions<T> = {},
    params?: ItemQueryParams,
  ): Promise<T | null> {
    const p = this.itemQueryBuilder?.parseParams(params);

    options = this.getFindOptions(
      merge({}, { where }, p, options),
    ) as FindOneOptions<T>;

    return this.getRepository().findOne(
      options as FindOneOptions<BaseEntity>,
    ) as Promise<T | null>;
  }

  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return (await this.getRepository().findOne(
      filterCondition as FindOneOptions<BaseEntity>,
    )) as unknown as Promise<T>;
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return (await this.getRepository().find(
      relations as FindManyOptions<BaseEntity>,
    )) as unknown as Promise<T[]>;
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return (await this.getRepository().find(
      options as FindManyOptions<BaseEntity>,
    )) as unknown as Promise<T[]>;
  }

  public async remove(data: T | FindOneOptions<T>): Promise<T> {
    let d: T;

    if (data instanceof BaseEntity) {
      d = data;
    } else {
      d = await this.findOne(data);
    }

    return (await this.getRepository().remove(d)) as unknown as Promise<T>;
  }

  async update(
    e: T | FindOptionsWhere<T>,
    attributes: DeepPartial<T>,
    orFail?: true,
    saveOptions?: SaveOptions,
  ): Promise<T>;

  async update(
    e: T | FindOptionsWhere<T>,
    attributes: DeepPartial<T>,
    orFail: false,
    saveOptions?: SaveOptions,
  ): Promise<T | undefined>;

  async update(
    e: T | FindOptionsWhere<T>,
    attributes: DeepPartial<T>,
    orFail = true,
    saveOptions?: SaveOptions,
  ): Promise<T | undefined> {
    this.model = await this.parseEntity(e, orFail);

    if (!this.model) {
      return;
    }

    if (this.updateOptions?.except !== undefined) {
      const { values, key } = this.updateOptions.except;

      const value = this.model[key ?? 'id'];

      if (values.includes(value)) {
        throw new HttpException(
          'Resource cannot be updated',
          HttpStatus.FORBIDDEN,
        );
      }
    }

    attributes = this.getAttributes(attributes);

    this.model = this.getRepository().merge(
      this.model,
      attributes,
    ) as unknown as T;

    return this.model.save(saveOptions);
  }

  async updateOrCreate(
    e: QueryDeepPartialEntity<T> | Array<QueryDeepPartialEntity<T>>,
    conflictPaths: string[],
  ): Promise<T> {
    const upsertResult: InsertResult = await this.getRepository().upsert(e, {
      conflictPaths,
    });

    return this.findOne({
      where: upsertResult.identifiers[0] as FindOptionsWhere<T>,
    });
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return (await this.getRepository().preload(
      entityLike,
    )) as unknown as Promise<T>;
  }

  async parseEntity(
    e: T | FindOptionsWhere<T>,
    orFail = true,
  ): Promise<T | null> {
    if (e instanceof this.entity) {
      return e as T;
    }

    e = e as FindOptionsWhere<T>;

    const item = this.findOne({ where: e });

    if (orFail && !item) {
      throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
    }
    return item;
  }

  protected getFindOptions(
    options?: FindOneOptions<T>,
  ): FindOneOptions<T> | undefined;

  protected getFindOptions(
    options?: FindManyOptions<T>,
  ): FindManyOptions<T> | undefined;

  protected getFindOptions(
    options?: FindManyOptions<T> | FindOneOptions<T>,
  ): FindManyOptions<T> | FindOneOptions<T> | undefined {
    const opt = FindOptionsUtil.merge(this.findOptions, options) ?? {};
    opt.order = options?.order || opt.order;

    return opt;
  }

  protected getAttributes(attributes: DeepPartial<T>): DeepPartial<T>;

  protected getAttributes(
    attributes: Array<DeepPartial<T>>,
  ): Array<DeepPartial<T>>;

  protected getAttributes(
    attributes: DeepPartial<T> | Array<DeepPartial<T>>,
  ): DeepPartial<T> | Array<DeepPartial<T>>;

  protected getAttributes(
    attributes: DeepPartial<T> | Array<DeepPartial<T>>,
  ): DeepPartial<T> | Array<DeepPartial<T>> {
    if (Array.isArray(attributes)) {
      return attributes.map((i) => ({ ...this.defaultAttributes, ...i }));
    }

    return { ...this.defaultAttributes, ...attributes } as DeepPartial<T>;
  }

  async parseEntities(e: T[] | string[], bindingKey = 'uuid'): Promise<T[]> {
    if (!toBoolean(e[0])) {
      return [];
    }

    if (e[0] instanceof this.entity) {
      return e as T[];
    }

    const query = this.getRepository().createQueryBuilder('e');

    return query
      .where(`e.${bindingKey} IN (:...values)`, { values: e })
      .getMany() as Promise<T[]>;
  }

  protected getRepository() {
    return this.getEntity().getRepository();
  }

  protected getEntity() {
    if (!this.entity)
      throw new HttpException('Resource cannot be found', HttpStatus.NOT_FOUND);

    return this.entity as typeof BaseEntity & T & typeof FindOptions;
  }
  protected cartesianMerge(
    arr1: Array<FindOptionsWhere<T>>,
    arr2: Array<FindOptionsWhere<T>>,
  ) {
    if (!toBoolean(arr1) || !toBoolean(arr2)) {
      return [];
    }

    const result: Array<FindOptionsWhere<T>> = [];

    for (const obj1 of arr1) {
      for (const obj2 of arr2) {
        result.push({ ...obj1, ...obj2 });
      }
    }

    return result;
  }
}
