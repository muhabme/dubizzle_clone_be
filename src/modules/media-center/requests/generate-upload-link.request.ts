import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

import { getEnumValues } from 'src/lib/utils/enums';
import { MediaFileType } from '../enums/media-file-type.enum';

export class GenerateUploadLinkRequest {
  @IsNotEmpty()
  @IsString()
  model_type: string;

  @IsNotEmpty()
  @IsString()
  file_name: string;

  @IsNotEmpty()
  @IsNotEmpty()
  @IsInt()
  size_in_bytes: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(getEnumValues(MediaFileType))
  mime_type: MediaFileType;
}
