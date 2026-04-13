import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DonationService } from './donation.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';

@Controller('donation')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Post()
  create(@Body() createDonationDto: CreateDonationDto) {
    return this.donationService.create(createDonationDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDonationDto: UpdateDonationDto) {
    return this.donationService.update(+id, updateDonationDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.donationService.delete(+id);
  }

  @Get('all')
  getAll() {
    return this.donationService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.donationService.getOne(+id);
  }
}
