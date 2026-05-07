import {IsString, IsBoolean, IsOptional, IsNotEmpty, IsNumber, IsEmail, Length, IsPositive} from "class-validator";

export class CreateSponsorDto {
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

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  recurrence?: string;

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

  @IsString()
  @IsOptional()
  @Length(1, 100)
  billingType?: string;

  @IsString()
  @IsOptional()
  billingData?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
