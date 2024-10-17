import { fileExtension } from '@lib/helpers/file';
import { Env } from '@lib/utils/env';
import { Type } from 'class-transformer';
import { AfterLoad, Column, Entity, Index } from 'typeorm';

import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseModel } from 'src/lib/entities/base.entity';
import { StorageDisk } from 'src/lib/storage/contracts/storage.disk.contract';
import { getEnumValues } from 'src/lib/utils/enums';
import { MediaFileType } from 'src/modules/media-center/enums/media-file-type.enum';

@Index(['order_column'])
@Index(['model_type', 'model_id'])
@Entity({ name: 'media' })
export class Media extends BaseModel {
  static async fileExtension(mimeType: string): Promise<string> {
    const ext = await fileExtension(mimeType);

    if (ext === undefined) {
      throw new HttpException('Invalid Media Type', HttpStatus.FORBIDDEN);
    }

    return ext;
  }

  @Column({ type: 'bigint', nullable: true })
  model_id: number;

  @Column({ type: 'varchar' })
  model_type: string;

  @Column({ type: 'bigint', nullable: true })
  uploader_id: number;

  @Column({ type: 'varchar' })
  uploader_type: string;

  @Column({ type: 'varchar' })
  file_name: string;

  @Column({ type: 'enum', enum: getEnumValues(MediaFileType), nullable: false })
  mime_type: MediaFileType;

  @Column({
    type: 'enum',
    enum: getEnumValues(StorageDisk),
    nullable: false,
  })
  disk: StorageDisk;

  @Column({ type: 'varchar', nullable: true })
  path?: string;

  @Column({ type: 'varchar', nullable: true })
  extension?: string;

  @Column({ type: 'bigint' })
  @Type(() => Number)
  size_in_bytes: number;

  @Column({ type: 'bigint', nullable: true })
  order_column: number;

  @Column({ type: 'datetime', nullable: false })
  uploaded_at?: Date;

  url: string;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  async urlToDestination(folder: string): Promise<string> {
    return `${Env.get('AWS_S3_DOMAIN').asString()}/${await this.pathToFolder(folder)}`;
  }

  async urlToFolder(folder: string, usePath = false): Promise<string> {
    const url = Env.get('AWS_S3_DOMAIN').asString();

    return `${url}/${usePath ? this.path : await this.pathToFolder(folder)}`;
  }

  async pathToFolder(folder: string, extension?: string) {
    if (extension === undefined) {
      extension = await Media.fileExtension(this.mime_type);
    }

    return `${folder}/${this.uuid}.${extension}`;
  }

  @AfterLoad()
  async appendUrl(folder?: string, usePath = false) {
    this.url = await this.urlToFolder(folder ?? 'temp', usePath);
  }
}
