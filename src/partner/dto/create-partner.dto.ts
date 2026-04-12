import {IsString, IsBoolean, IsOptional, IsNotEmpty, IsNumber, Length} from "class-validator";

export class CreatePartnerDto {
  @IsNumber()
  @IsNotEmpty()
  personId!: number;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  corporateName?: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  tradeName?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
