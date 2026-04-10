import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Person } from "./entities/person.entity";
import { Repository } from "typeorm";
import { AddressService } from "../address/address.service";
import { CreatePersonDto } from "./dto/create-person.dto";
import { UpdatePersonDto } from "./dto/update-person.dto";

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly addressService: AddressService
  ) {}

  async create(body: CreatePersonDto): Promise<Person> {
    const address = await this.addressService.getOne(body.addressId);

    if (!address) {
      throw new NotFoundException('Endereço não encontrado');
    }

    const person = this.personRepository.create(body);
    return this.personRepository.save(person);
  }

  async update(id: number, body: UpdatePersonDto): Promise<Person> {
    const person = await this.personRepository.findOne({
      where: { id }
    });

    if (!person) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    if (body.addressId !== undefined) {
      const address = await this.addressService.getOne(body.addressId);

      if (!address) {
        throw new NotFoundException('Endereço não encontrado');
      }
    }

    const updatedPerson = this.personRepository.merge(person, body);
    return this.personRepository.save(updatedPerson);
  }

  async delete(id: number) {
    const person = await this.personRepository.findOne({ where: { id } });

    if (!person) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    await this.personRepository.softDelete(id);

    return { message: 'Pessoa removida com sucesso' };
  }

  async getAll() {
    return this.personRepository.find({
      relations: ['address']
    });
  }

  async getOne(id: number) {
    const person = await this.personRepository.findOne({
      where: { id },
      relations: ['address']
    });

    if (!person) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    return person;
  }
}
