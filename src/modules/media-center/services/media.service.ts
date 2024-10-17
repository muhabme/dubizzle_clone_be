import {
  StorageDisk,
  type DiskStorageContract,
  type PreSignedUrl,
  type PreSignedUrlOptions,
} from '@lib/storage/contracts/storage.disk.contract';
import { DiskStorageManager } from '@lib/storage/managers/storage-disk.manager';
import { Env } from '@lib/utils/env';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { toNumber } from 'lodash';
import type { DeepPartial } from 'typeorm';

import { Media } from 'src/entities/media-center/media.entity';
import { CrudService } from 'src/lib/services/crud.service';
import type { GenerateUploadLinkRequest } from '../requests/generate-upload-link.request';

@Injectable()
export class MediaService extends CrudService<Media> {
  private diskMapper: Record<'production' | 'development', StorageDisk>;

  private diskName: StorageDisk | undefined;

  constructor(private readonly diskStorageManager: DiskStorageManager) {
    super(Media);

    this.diskMapper = {
      production: StorageDisk.S3,
      development: StorageDisk.S3,
    };

    const nodeEnv: string | undefined = Env.getOptional('NODE_ENV')?.asString();

    this.diskName = nodeEnv && this.diskMapper[nodeEnv];
  }

  async createPreSignedUrl(
    data: GenerateUploadLinkRequest | DeepPartial<Media>,
  ): Promise<PreSignedUrl> {
    const disk = await this.getDisk();
    const media = await this.create({
      ...data,
      disk: disk.name,
    });

    const extension = await Media.fileExtension(media.mime_type);
    const path = await media.pathToFolder('temp');

    Object.assign(media, { path, extension });

    await media.save();

    const preSignedUrlOptions: PreSignedUrlOptions = {
      key: path,
      mimeType: data.mime_type,
    };

    return disk.createPreSignedUrl(preSignedUrlOptions);
  }

  async validate(
    media: Media | Media[],
    d?: DiskStorageContract,
  ): Promise<boolean> {
    if (Array.isArray(media)) {
      for await (const item of media) {
        await this.validate(item, d);
      }

      return true;
    }

    const disk = d ?? (await this.getDisk(media.disk));

    if (media.uploaded_at === null || media.uploaded_at === undefined) {
      const { contentLength, contentType } = await disk.info(
        await media.pathToFolder('temp'),
      );

      if (!(toNumber(contentLength) === toNumber(media.size_in_bytes))) {
        throw new HttpException('Invalid Media Type', HttpStatus.FORBIDDEN);
      }
      if (contentType !== media.mime_type) {
        throw new HttpException('Invalid Media Type', HttpStatus.FORBIDDEN);
      }
    }

    return true;
  }

  async saveToDestination({
    relatedModel,
    items,
    destinationFolder,
    validate = true,
  }: {
    relatedModel;
    items: Media[];
    destinationFolder: string;
    validate?: boolean;
  }): Promise<Media[]> {
    const disk = await this.getDisk();

    for await (const item of items) {
      if (validate) {
        await this.validate(item, disk);
      }

      if (item.uploaded_at) {
        continue;
      }

      const newPath = await item.pathToFolder(destinationFolder);

      await disk.move(item.path!, newPath, { contentType: item.mime_type });

      item.path = newPath;
      item.model_id = relatedModel.id;
      item.uploaded_at = dayjs().toDate();
    }

    return Media.save(items);
  }

  private async getDisk(
    diskName: StorageDisk | undefined = this.diskName,
  ): Promise<DiskStorageContract> {
    return this.diskStorageManager.diskOf(diskName ?? StorageDisk.S3);
  }
}
