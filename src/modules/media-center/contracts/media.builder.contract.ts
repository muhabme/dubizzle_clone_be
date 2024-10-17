import type { PreSignedUrl } from '@lib/storage/contracts/storage.disk.contract';
import { Media } from 'src/entities/media-center/media.entity';
import type { DeepPartial } from 'typeorm';

export interface MediaBuilderContract {
  preSignedUrl(data: DeepPartial<Media>): Promise<PreSignedUrl>;
}
