import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnerService.create(createPartnerDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnerService.update(+id, updatePartnerDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.partnerService.delete(+id);
  }

  @Get('all')
  async getAll() {
    return await this.partnerService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.partnerService.getOne(+id);
  }
}
