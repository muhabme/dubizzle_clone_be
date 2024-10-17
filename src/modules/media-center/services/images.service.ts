import { Injectable } from '@nestjs/common';

import { Media } from 'src/entities/media-center/media.entity';
import { MediaService } from './media.service';

export interface SaveImagesOptions {
  relatedModel;
  items: Media[];
  folder: string;
  validate?: boolean;
}

@Injectable()
export class ImagesService {
  constructor(private readonly mediaService: MediaService) {}

  async saveToDestination({
    relatedModel,
    items,
    folder,
    validate = false,
  }: SaveImagesOptions): Promise<Media[]> {
    return this.mediaService.saveToDestination({
      relatedModel,
      items,
      destinationFolder: folder,
      validate,
    });
  }

  async validateAndMapTo(
    folder: string,
    items?: Media,
  ): Promise<string | undefined>;

  async validateAndMapTo(
    folder: string,
    items?: Media[],
  ): Promise<string[] | undefined>;

  async validateAndMapTo(
    folder: string,
    items?: Media | Media[],
  ): Promise<string | string[] | undefined> {
    if (items === undefined) {
      return items as undefined;
    }

    await this.mediaService.validate(items);

    if (!Array.isArray(items)) {
      return items.urlToFolder(folder);
    }

    const images: string[] = [];

    for await (const item of items) {
      images.push(await item.urlToFolder(folder));
    }

    return images;
  }
}
