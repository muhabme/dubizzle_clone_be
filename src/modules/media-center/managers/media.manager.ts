import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { camelCase } from 'lodash';

import { MediaBuilder } from '../builders/media.builder';
import type { MediaBuilderContract } from '../contracts/media.builder.contract';
import { MediaFileType } from '../enums/media-file-type.enum';

@Injectable()
export class MediaManager {
  private readonly buildersMapper: Partial<
    Record<MediaFileType, MediaBuilderContract>
  > = {
    [MediaFileType.JPG]: MediaBuilder as unknown as MediaBuilderContract,
    [MediaFileType.PNG]: MediaBuilder as unknown as MediaBuilderContract,
  };

  constructor(private moduleRef: ModuleRef) {}

  async builderOf(fileType: MediaFileType): Promise<MediaBuilderContract> {
    const builderClass: typeof MediaBuilder | undefined =
      this.buildersMapper[camelCase(fileType)];

    return this.moduleRef.resolve(builderClass ?? MediaBuilder);
  }
}
