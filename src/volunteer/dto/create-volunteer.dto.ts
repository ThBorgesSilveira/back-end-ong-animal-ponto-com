import {IsBoolean, IsNumber, IsOptional, IsNotEmpty, IsString, IsEnum, Length, ValidateNested, IsDate} from "class-validator";
import { PersonType } from "../../person/enums/person-type.enum";
import { Type } from "class-transformer";

export class CreateVolunteerAddressDto {
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

export class CreateVolunteerPersonDto {
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
  @Type(() => CreateVolunteerAddressDto)
  address!: CreateVolunteerAddressDto;
}
export class CreateVolunteerDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  birthDate!: Date;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
  
  @ValidateNested()
  @Type(() => CreateVolunteerPersonDto)
  person!: CreateVolunteerPersonDto;
}
