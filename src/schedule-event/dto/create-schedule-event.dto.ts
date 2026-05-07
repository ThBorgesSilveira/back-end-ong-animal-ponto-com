import { IsString, IsNumber, IsBoolean, IsDateString, IsOptional, IsNotEmpty } from "class-validator";

export class CreateScheduleEventDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsDateString()
  @IsNotEmpty()
  eventDate!: string;

  @IsString()
  @IsNotEmpty()
  eventType!: string;

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
