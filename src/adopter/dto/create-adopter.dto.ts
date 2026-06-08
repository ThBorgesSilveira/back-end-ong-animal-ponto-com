import {IsString, IsOptional, IsNotEmpty, IsDateString, Length, ValidateNested, IsEnum, IsEmail,} from "class-validator";
import { Type } from "class-transformer";
import { PersonType } from "../../person/enums/person-type.enum";

export class CreateAdopterAddressDto {
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

export class CreateAdopterPersonDto {
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
  @Type(() => CreateAdopterAddressDto)
  address!: CreateAdopterAddressDto;
}

export class CreateAdopterDto {
  @ValidateNested()
  @Type(() => CreateAdopterPersonDto)
  person!: CreateAdopterPersonDto;

  @IsDateString()
  @IsOptional()
  birthDate?: string;

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
