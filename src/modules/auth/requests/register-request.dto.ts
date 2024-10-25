import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class RegisterRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsDateString()
  birth_date: Date;

  // @IsString()
  // @IsNotEmpty()
  // mobile: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
