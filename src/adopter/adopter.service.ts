import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Adopter } from "./entities/adopter.entity";
import { CreateAdopterDto } from "./dto/create-adopter.dto";
import { UpdateAdopterDto } from "./dto/update-adopter.dto";
import { PersonService } from "../person/person.service";
import { AddressService } from "../address/address.service";
import { CreateAddressDto } from "../address/dto/create-address.dto";

@Injectable()
export class AdopterService {
  constructor(
    @InjectRepository(Adopter)
    private readonly adopterRepository: Repository<Adopter>,
    private readonly personService: PersonService,
    private readonly addressService: AddressService
  ) {}

  async create(body: CreateAdopterDto): Promise<Adopter> {
    const normalizedCpfCnpj = body.person.cpfCnpj.replace(/\D/g, "").slice(0, 20);

    const existingPersonId = await this.personService.findByCpfCnpj(normalizedCpfCnpj);
    if (existingPersonId) {
      throw new ConflictException("Pessoa já cadastrada");
    }

    const normalizedPostalCode = body.person.address.postalCode.replace(/\D/g, "").slice(0, 8);

    const addressPayload: CreateAddressDto = {
      countryCode: "BR",
      state: body.person.address.state,
      city: body.person.address.city,
      district: body.person.address.district,
      street: body.person.address.street,
      number: body.person.address.number ?? "",
      postalCode: normalizedPostalCode,
    };

    let addressId = await this.addressService.findByFields(addressPayload);
    if (!addressId) {
      const newAddress = await this.addressService.create(addressPayload);
      addressId = newAddress.id;
    }

    const person = await this.personService.create({
      name: body.person.name,
      personType: body.person.personType,
      cpfCnpj: normalizedCpfCnpj,
      addressId,
    });

    const adopter = this.adopterRepository.create({
      personId: person.id,
      age: body.age,
      notes: body.notes,
      email: body.email,
      phone: body.phone,
      socialNetwork: body.socialNetwork,
    });

    return this.adopterRepository.save(adopter);
  }

  async update(id: number, body: UpdateAdopterDto): Promise<Adopter> {
    const adopter = await this.adopterRepository.findOne({
      where: { id }
    });

    if (!adopter) {
      throw new NotFoundException("Adotante não encontrado");
    }

    if (body.person?.cpfCnpj) {
      const normalizedCpfCnpj = body.person.cpfCnpj.replace(/\D/g, "").slice(0, 20);

      const personId = await this.personService.findByCpfCnpj(normalizedCpfCnpj);

      if (!personId) {
        throw new NotFoundException(`Pessoa com CPF/CNPJ ${normalizedCpfCnpj} não encontrada`);
      }

      if (personId !== adopter.personId) {
        adopter.personId = personId;
      }
    }

    const updatedAdopter = this.adopterRepository.merge(adopter, {
      age: body.age,
      notes: body.notes,
      email: body.email,
      phone: body.phone,
      socialNetwork: body.socialNetwork,
    });

    return this.adopterRepository.save(updatedAdopter);
  }

  async delete(id: number) {
    const adopter = await this.adopterRepository.findOne({
      where: { id }
    });

    if (!adopter) {
      throw new NotFoundException("Adotante não encontrado");
    }

    await this.adopterRepository.softDelete(id);

    return { message: "Adotante removido com sucesso" };
  }

  async getAll() {
    return this.adopterRepository.find({
      relations: ["person", "person.address"]
    });
  }

  async getOne(id: number) {
    const adopter = await this.adopterRepository.findOne({
      where: { id },
      relations: ["person", "person.address"]
    });

    if (!adopter) {
      throw new NotFoundException("Adotante não encontrado");
    }

    return adopter;
  }
}
