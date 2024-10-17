import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class PromoteListingDto {
  @IsString()
  @IsNotEmpty()
  promotionType: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;
}
