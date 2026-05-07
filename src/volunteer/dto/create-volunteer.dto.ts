import {IsBoolean, IsNumber, IsOptional, IsNotEmpty, IsString} from "class-validator";

export class CreateVolunteerDto {
  @IsNumber()
  @IsNotEmpty()
  age!: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsNotEmpty()
  personId!: number;
}
