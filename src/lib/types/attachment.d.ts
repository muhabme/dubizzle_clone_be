import type { MediaFileType } from '../../modules/media-center/enums/media-file-type.enum';

export interface IAttachment {
  name: string;
  type: MediaFileType;
  key: string;
  url: string;
}
