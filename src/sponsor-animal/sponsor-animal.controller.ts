import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SponsorAnimalService } from './sponsor-animal.service';
import { CreateSponsorAnimalDto } from './dto/create-sponsor-animal.dto';
import { UpdateSponsorAnimalDto } from './dto/update-sponsor-animal.dto';

@Controller('sponsor-animal')
export class SponsorAnimalController {
  constructor(private readonly sponsorAnimalService: SponsorAnimalService) {}

  @Post()
  create(@Body() createSponsorAnimalDto: CreateSponsorAnimalDto) {
    return this.sponsorAnimalService.create(createSponsorAnimalDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSponsorAnimalDto: UpdateSponsorAnimalDto) {
    return this.sponsorAnimalService.update(+id, updateSponsorAnimalDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.sponsorAnimalService.delete(+id);
  }

  @Get('all')
  async getAll() {
    return this.sponsorAnimalService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.sponsorAnimalService.getOne(+id);
  }
}
