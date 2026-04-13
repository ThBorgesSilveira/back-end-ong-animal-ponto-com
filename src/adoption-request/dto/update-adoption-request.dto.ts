import { PartialType } from '@nestjs/mapped-types';
import { CreateAdoptionRequestDto } from './create-adoption-request.dto';

export class UpdateAdoptionRequestDto extends PartialType(CreateAdoptionRequestDto) {}
