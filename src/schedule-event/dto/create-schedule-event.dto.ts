import { IsString, IsNumber, IsBoolean, IsDateString, IsOptional, IsNotEmpty } from "class-validator";

export class CreateScheduleEventDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsDateString()
  @IsNotEmpty()
  dateEvent!: string;

  @IsString()
  @IsNotEmpty()
  typeEvent!: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsNotEmpty()
  addressId!: number;
}
