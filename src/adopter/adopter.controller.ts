import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdopterService } from './adopter.service';
import { CreateAdopterDto } from './dto/create-adopter.dto';
import { UpdateAdopterDto } from './dto/update-adopter.dto';

@Controller('adopter')
export class AdopterController {
  constructor(private readonly adopterService: AdopterService) {}

  @Post()
  create(@Body() createAdopterDto: CreateAdopterDto) {
    return this.adopterService.create(createAdopterDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdopterDto: UpdateAdopterDto) {
    return this.adopterService.update(+id, updateAdopterDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.adopterService.delete(+id);
  }

  @Get('all')
  async getAll() {
    return await this.adopterService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.adopterService.getOne(+id);
  }
}
