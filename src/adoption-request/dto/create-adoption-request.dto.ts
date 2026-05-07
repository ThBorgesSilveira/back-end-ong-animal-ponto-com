import {IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum} from "class-validator";
import { EnumAdoptionRequestStatus } from "../entities/adoption-request.entity";

export class CreateAdoptionRequestDto {
  @IsNumber()
  @IsNotEmpty()
  personId!: number;

  @IsNumber()
  @IsNotEmpty()
  animalId!: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(EnumAdoptionRequestStatus)
  @IsOptional()
  status?: EnumAdoptionRequestStatus;
}
