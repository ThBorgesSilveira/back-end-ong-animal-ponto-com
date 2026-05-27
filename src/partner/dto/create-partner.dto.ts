import {IsString, IsBoolean, IsOptional, IsNotEmpty, IsNumber, Length, ValidateNested,} from "class-validator";
import { Type } from "class-transformer";

export class CreatePartnerAddressDto {
  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  district!: string;

  @IsString()
  @IsNotEmpty()
  street!: string;

  @IsString()
  @IsOptional()
  number?: string;

  @IsString()
  @IsNotEmpty()
  postalCode!: string;
}

export class CreatePartnerPersonDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  cpfCnpj!: string;

  @ValidateNested()
  @Type(() => CreatePartnerAddressDto)
  address!: CreatePartnerAddressDto;
}

export class CreatePartnerDto {
  @ValidateNested()
  @Type(() => CreatePartnerPersonDto)
  person!: CreatePartnerPersonDto;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  corporateName?: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  tradeName?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}