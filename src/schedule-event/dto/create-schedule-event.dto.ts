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
  observations?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsNumber()
  @IsNotEmpty()
  addressId!: number;
}
