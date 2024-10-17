import type { PreSignedUrl } from '@lib/storage/contracts/storage.disk.contract';
import { Injectable } from '@nestjs/common';
import type { DeepPartial } from 'typeorm';

import { Media } from 'src/entities/media-center/media.entity';
import type { MediaBuilderContract } from '../contracts/media.builder.contract';
import { MediaService } from '../services/media.service';

@Injectable()
export class MediaBuilder implements MediaBuilderContract {
  constructor(protected readonly mediaService: MediaService) {}

  preSignedUrl(data: DeepPartial<Media>): Promise<PreSignedUrl> {
    return this.mediaService.createPreSignedUrl(data);
  }
}
