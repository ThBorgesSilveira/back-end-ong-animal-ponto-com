import {IsString, IsNumber, IsNotEmpty, IsOptional, IsPositive, Length} from "class-validator";

export class CreateDonationDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  donationType!: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount!: number;

  @IsNumber()
  @IsNotEmpty()
  personId!: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
