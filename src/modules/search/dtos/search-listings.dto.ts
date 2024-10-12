import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

export class SearchListingsDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortByPrice?: 'asc' | 'desc';
}
