import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { toBoolean } from 'src/lib/helpers/boolean';

export class ListingListQueryParams {
  @IsOptional()
  @Transform((v) => {
    console.log(v);
    return toBoolean(v);
  })
  @IsBoolean()
  isOnSale: boolean;

  @IsOptional()
  @Transform((v) => toBoolean(v))
  @IsBoolean()
  isFeatured: boolean;

  @IsOptional()
  @IsUUID()
  category: string;
}
