import { DiskStorageManager } from '@lib/storage/managers/storage-disk.manager';
import { Env } from '@lib/utils/env';
import { Injectable } from '@nestjs/common';
import { Mixin } from 'ts-mixer';
import type { DeepPartial } from 'typeorm';

import type { GenerateUploadLinkRequest } from '../requests/generate-upload-link.request';
import { MediaService } from './media.service';
import { StorageDisk } from 'src/lib/storage/contracts/storage.disk.contract';
import { Media } from 'src/entities/media-center/media.entity';

@Injectable()
export class CSVsMediaService {
  constructor(
    private readonly mediaService: MediaService,
    private readonly diskManager: DiskStorageManager,
  ) {}

  async createOrUpdateMedia(
    media: GenerateUploadLinkRequest | DeepPartial<Media>,
  ) {
    const existingMedia = await Media.findOne({
      where: { file_name: media.file_name },
    });

    return existingMedia
      ? this.mediaService.update(existingMedia, media)
      : this.mediaService.create({ ...media, disk: StorageDisk.S3 });
  }

  async upload(d: Buffer, key: string, mimeType = 'text/csv') {
    const disk = await this.getDisk();
    const isExist = await disk.exists(key);

    if (isExist) {
      await disk.delete(key);
    }

    return disk.upload(d, key, mimeType);
  }

  async info(key: string) {
    const disk = await this.getDisk();
    const isExist = await disk.exists(key);

    if (isExist) {
      return disk.info(key);
    }
  }

  async getDisk() {
    const diskMapper: Record<'production' | 'development', StorageDisk> = {
      production: StorageDisk.S3,
      development: StorageDisk.S3,
    };

    const nodeEnv: string | undefined = Env.getOptional('NODE_ENV')?.asString();

    const diskName: StorageDisk | undefined = nodeEnv && diskMapper[nodeEnv];

    return this.diskManager.diskOf(diskName ?? StorageDisk.S3);
  }
}
