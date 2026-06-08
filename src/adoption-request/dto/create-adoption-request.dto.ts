import { IsNotEmpty, IsNumber, IsString, IsEnum, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateAdopterDto } from "../../adopter/dto/create-adopter.dto";
import { EnumAdoptionRequestStatus } from "../entities/adoption-request.entity";

export class CreateAdoptionRequestDto {
  @ValidateNested()
  @Type(() => CreateAdopterDto)
  @IsNotEmpty()
  adopter!: CreateAdopterDto;

  @IsNumber()
  @IsNotEmpty()
  animalId!: number;

  @IsString()
  notes?: string;

  @IsEnum(EnumAdoptionRequestStatus)
  status?: EnumAdoptionRequestStatus;
}
