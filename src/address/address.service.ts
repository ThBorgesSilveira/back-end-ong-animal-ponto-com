import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(AddressEntity)
        private readonly addressRepository: Repository<AddressEntity>,
    ) {}

    async create(body: CreateAddressDto): Promise<AddressEntity> {
        const newAdress = {
            ...body
        }

        const address = await this.addressRepository.create(newAdress);

        return await this.addressRepository.save(address);
    }

    async getAll() {
        const addresses = await this.addressRepository.find();
        return addresses;
    }

    async getOne(id: number) {
        const address = await this.addressRepository.findOne({ where: { id } });
        if (!address) {
            throw new NotFoundException('Address not found');
        }
        return address;
    }

    async update(id: number, body: UpdateAddressDto) {
        const address = await this.addressRepository.findOne({
            where: { id }
        })

        if(!address) throw new NotFoundException('Address not found');

        const updateAddress = await this.addressRepository.merge(address, body);

        return await this.addressRepository.save(updateAddress);
    }
    
    async delete(id: number) {
        const result = await this.addressRepository.softDelete(id);

        if (result.affected === 0) {
            throw new NotFoundException('Address not found');
        }

        return { message: 'Address soft deleted successfully' };
    }
}
