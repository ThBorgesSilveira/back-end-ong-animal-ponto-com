import {IsString, IsBoolean, IsOptional, IsNotEmpty, IsNumber, Length, ValidateNested, IsEnum,} from "class-validator";
import { Type } from "class-transformer";
import { PartnerType } from "../enums/partner-type.enum";
import { PersonType } from "../../person/enums/person-type.enum";

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

  @IsEnum(PersonType)
  @IsNotEmpty()
  personType!: PersonType;

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

  @IsEnum(PartnerType)
  @IsNotEmpty()
  partnershipType!: PartnerType;

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