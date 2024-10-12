import {
  BaseEntity,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  SaveOptions,
  Repository,
} from 'typeorm';

export abstract class CrudService<T extends BaseEntity> {
  protected constructor(protected repository: Repository<T>) {}

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
      const e = this.repository.create(
        attributes as Array<DeepPartial<T>>,
      ) as T[];

      for await (const item of e) {
        await this.repository.save(item);
      }

      return e;
    }

    const e = this.repository.create(attributes as DeepPartial<T>);
    return this.repository.save(e, saveOptions);
  }

  async findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
    return this.repository.findAndCount(options);
  }

  public async findOneById(id: any): Promise<T> {
    return this.repository.findOneBy({ id } as FindOptionsWhere<T>);
  }

  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return this.repository.findOne(filterCondition);
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(relations);
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  public async remove(data: T): Promise<T> {
    return this.repository.remove(data);
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return this.repository.preload(entityLike);
  }

  protected getRepository() {
    return this.repository;
  }
}
