import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';

@Controller('sponsor')
export class SponsorController {
  constructor(private readonly sponsorService: SponsorService) {}

  @Post()
  create(@Body() createSponsorDto: CreateSponsorDto) {
    return this.sponsorService.create(createSponsorDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSponsorDto: UpdateSponsorDto) {
    return this.sponsorService.update(+id, updateSponsorDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.sponsorService.delete(+id);
  }

  @Get('all')
  async getAll() {
    return await this.sponsorService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.sponsorService.getOne(+id);
  }
}
