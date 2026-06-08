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
  // Processo de criação da Person:
  //  1. Verificar se já existe uma pessoa com o mesmo CPF/CNPJ
  //    1.1. Caso exista, atualizar os dados (método update) e retornar a pessoa atualizada
  //    1.2. Caso contrário, criar uma nova pessoa
  //  2. Verificar se o endereço existe, caso contrário lançar NotFoundException
  //  3. Gravar a pessoa e retornar a pessoa criada

    const normalizedCpfCnpj = body.cpfCnpj.replace(/\D/g, "").slice(0, 20);

    const existingPerson = await this.findByCpfCnpj(normalizedCpfCnpj);

    if (existingPerson) {
      const updateData: UpdatePersonDto = {
        name: body.name,
        personType: body.personType,
        isActive: body.isActive,
        addressId: body.addressId,
      };

      return this.update(existingPerson.id, updateData);
    }

    const address = await this.addressService.getOne(body.addressId);

    if (!address) {
      throw new NotFoundException("Endereço não encontrado");
    }

    const person = this.personRepository.create(body);
    return this.personRepository.save(person);
  }

  async update(id: number, body: UpdatePersonDto): Promise<Person> {
  // Processo de atualização da Person:
  //  1. Verificar se a pessoa existe, caso contrário lançar NotFoundException
  //  2. Se o body contiver addressId, verificar se o endereço existe, caso contrário lançar NotFoundException
  //  3. Atualizar os dados da pessoa e retornar a pessoa atualizada

    const person = await this.personRepository.findOne({
      where: { id }
    });

    if (!person) {
      throw new NotFoundException("Pessoa não encontrada");
    }

    if (body.addressId !== undefined) {
      const address = await this.addressService.getOne(body.addressId);

      if (!address) {
        throw new NotFoundException("Endereço não encontrado");
      }
    }

    const updatedPerson = this.personRepository.merge(person, body);
    return this.personRepository.save(updatedPerson);
  }

  async delete(id: number) {
    const person = await this.personRepository.findOne({ where: { id } });

    if (!person) {
      throw new NotFoundException("Pessoa não encontrada");
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
      throw new NotFoundException("Pessoa não encontrada");
    }

    return person;
  }

  async findByCpfCnpj(cpfCnpj: string): Promise<Person | null> {
    const normalizedCpfCnpj = cpfCnpj.replace(/\D/g, "").slice(0, 20);
    const person = await this.personRepository.findOne({
      where: { cpfCnpj: normalizedCpfCnpj },
    });

    if (!person) return null;

    return person;
  }
}
