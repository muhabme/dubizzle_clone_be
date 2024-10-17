import {
  BaseEntity,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  SaveOptions,
} from 'typeorm';
import { FindOptions } from '../utils/find-options';

export abstract class CrudService<T extends BaseEntity> {
  protected constructor(protected entity: typeof BaseEntity) {}

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

  public async findOneById(
    id:
      | {
          id?: number;
        }
      | {
          uuid?: string;
        },
  ): Promise<T> {
    const options: FindOptionsWhere<T> = id as FindOptionsWhere<T>;
    return (await this.getRepository().findOneBy(
      options as FindOptionsWhere<BaseEntity>,
    )) as unknown as Promise<T>;
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

  public async update(
    data: T | FindOptionsWhere<T>,
    attributes: DeepPartial<T>,
  ): Promise<T> {
    return (await this.getRepository().update(
      data as FindOptionsWhere<BaseEntity>,
      attributes as DeepPartial<BaseEntity>,
    )) as unknown as Promise<T>;
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return (await this.getRepository().preload(
      entityLike,
    )) as unknown as Promise<T>;
  }

  protected getRepository() {
    return this.getEntity().getRepository();
  }

  protected getEntity() {
    if (!this.entity) throw new Error('No entity found');

    return this.entity as typeof BaseEntity & T & typeof FindOptions;
  }
}
