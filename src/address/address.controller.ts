import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@Body() body: CreateAddressDto) {
    return this.addressService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: UpdateAddressDto) {
    return this.addressService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.addressService.delete(id);
  }

  @Get('all')
  async getAll() {
      return await this.addressService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
      return await this.addressService.getOne(id);
  }
}