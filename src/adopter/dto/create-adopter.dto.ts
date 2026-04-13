import {IsString, IsNumber, IsOptional, IsNotEmpty, IsEmail, Length, IsPositive} from "class-validator";

export class CreateAdopterDto {
  @IsNumber()
  @IsNotEmpty()
  personId!: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  age?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  phone?: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  socialNetwork?: string;
}
