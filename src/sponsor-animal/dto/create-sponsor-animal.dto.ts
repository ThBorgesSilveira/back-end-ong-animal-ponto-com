import { IsNumber, IsNotEmpty } from "class-validator";

export class CreateSponsorAnimalDto {
  @IsNumber()
  @IsNotEmpty()
  sponsorId!: number;

  @IsNumber()
  @IsNotEmpty()
  animalId!: number;
}
