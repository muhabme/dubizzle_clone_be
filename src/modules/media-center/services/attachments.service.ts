import { Injectable } from '@nestjs/common';

import { Media } from 'src/entities/media-center/media.entity';
import { IAttachment } from 'src/lib/types/attachment';
import { MediaService } from './media.service';

export interface SaveAttachmentsOptions {
  relatedModel;
  items: Media[] | Media;
  folder: string;
  validate?: boolean;
}

export interface SaveMediaOptions {
  relatedModel;
  item: Media;
  folder: string;
  validate?: boolean;
}
@Injectable()
export class AttachmentsService {
  constructor(private readonly mediaService: MediaService) {}

  async saveToDestination({
    relatedModel,
    items,
    folder,
    validate = false,
  }: SaveAttachmentsOptions): Promise<Media[]> {
    items = Array.isArray(items) ? items : [items];

    return this.mediaService.saveToDestination({
      relatedModel,
      items,
      destinationFolder: folder,
      validate,
    });
  }

  async validateAndMapTo(
    folder: string,
    items?: Media[],
  ): Promise<IAttachment[] | undefined> {
    if (items === undefined) {
      return undefined;
    }

    await this.mediaService.validate(items);

    const attachments: IAttachment[] = [];

    for await (const item of items) {
      attachments.push({
        key: item.uuid,
        name: item.file_name,
        type: item.mime_type,
        url: await item.urlToFolder(`${folder}`),
      });
    }

    return attachments;
  }
}
