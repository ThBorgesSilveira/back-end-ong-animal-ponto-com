import {IsString, IsBoolean, IsOptional, IsNotEmpty, IsDateString, Length} from "class-validator";

export class CreateAnimalDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  size?: string;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  temperament?: string;

  @IsDateString()
  @IsOptional()
  rescueDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
