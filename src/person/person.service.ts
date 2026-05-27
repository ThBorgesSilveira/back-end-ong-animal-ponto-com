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
      throw new NotFoundException("Endereco nao encontrado");
    }

    const existingPerson = await this.personRepository.findOne({
      where: { cpfCnpj: body.cpfCnpj },
    });

    if (existingPerson) {
      const updatedExistingPerson = this.personRepository.merge(existingPerson, {
        name: body.name,
        personType: body.personType,
        addressId: body.addressId,
      });

      return this.personRepository.save(updatedExistingPerson);
    }

    const person = this.personRepository.create(body);
    return this.personRepository.save(person);
  }

  async update(id: number, body: UpdatePersonDto): Promise<Person> {
    const person = await this.personRepository.findOne({
      where: { id }
    });

    if (!person) {
      throw new NotFoundException("Pessoa nao encontrada");
    }

    if (body.addressId !== undefined) {
      const address = await this.addressService.getOne(body.addressId);

      if (!address) {
        throw new NotFoundException("Endereco nao encontrado");
      }
    }

    const updatedPerson = this.personRepository.merge(person, body);
    return this.personRepository.save(updatedPerson);
  }

  async delete(id: number) {
    const person = await this.personRepository.findOne({ where: { id } });

    if (!person) {
      throw new NotFoundException("Pessoa nao encontrada");
    }

    await this.personRepository.softDelete(id);

    return { message: "Pessoa removida com sucesso" };
  }

  async getAll() {
    return this.personRepository.find({
      relations: ["address"]
    });
  }

  async getOne(id: number) {
    const person = await this.personRepository.findOne({
      where: { id },
      relations: ["address"]
    });

    if (!person) {
      throw new NotFoundException("Pessoa nao encontrada");
    }

    return person;
  }

  async findByCpfCnpj(cpfCnpj: string): Promise<number | null> {
    const person = await this.personRepository.findOne({
      where: { cpfCnpj },
    });

    if (!person) return null;

    return person.id;
  }
}
