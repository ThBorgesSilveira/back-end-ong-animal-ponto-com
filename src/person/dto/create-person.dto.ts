import {IsString,IsBoolean,IsOptional,IsNotEmpty,IsNumber,Length} from "class-validator";

export class CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  personType!: string;

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
