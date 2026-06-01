import {IsString,IsBoolean,IsOptional,IsNotEmpty,IsNumber,Length, IsEnum} from "class-validator";
import { PersonType } from "../enums/person-type.enum";

export class CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PersonType)
  @Length(1, 50)
  personType!: PersonType;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  cpfCnpj!: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsNotEmpty()
  addressId!: number;
}
