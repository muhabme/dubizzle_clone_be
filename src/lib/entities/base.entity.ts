import { plainToClass } from 'class-transformer';
import { Mixin } from 'ts-mixer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseResponse } from '../responses/base.response';
import { FindOptions } from '../utils/find-options';

export abstract class BaseModel extends Mixin(BaseEntity, FindOptions) {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 36,
    unique: true,
  })
  @Generated('uuid')
  uuid: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  transform<T extends BaseResponse>(classResponse: ClassConstructor<T>): T {
    return plainToClass(classResponse, this, {
      excludeExtraneousValues: true,
    });
  }
}
