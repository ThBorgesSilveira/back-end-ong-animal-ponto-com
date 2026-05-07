import { PartialType } from '@nestjs/mapped-types';
import { CreateSponsorAnimalDto } from './create-sponsor-animal.dto';

export class UpdateSponsorAnimalDto extends PartialType(CreateSponsorAnimalDto) {}
