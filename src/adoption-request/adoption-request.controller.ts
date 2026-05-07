import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdoptionRequestService } from './adoption-request.service';
import { CreateAdoptionRequestDto } from './dto/create-adoption-request.dto';
import { UpdateAdoptionRequestDto } from './dto/update-adoption-request.dto';

@Controller('adoption-request')
export class AdoptionRequestController {
  constructor(private readonly adoptionRequestService: AdoptionRequestService) {}

  @Post()
  create(@Body() createAdoptionRequestDto: CreateAdoptionRequestDto) {
    return this.adoptionRequestService.create(createAdoptionRequestDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdoptionRequestDto: UpdateAdoptionRequestDto) {
    return this.adoptionRequestService.update(+id, updateAdoptionRequestDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.adoptionRequestService.delete(+id);
  }

  @Get('all')
  async getAll() {
    return this.adoptionRequestService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.adoptionRequestService.getOne(+id);
  }
}
