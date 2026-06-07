import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
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
    // 1. Verificar se já existe uma pessoa com o mesmo CPF/CNPJ (const person)
    //  1.1. Se existir
    //    1.1.2. Verificar se existe um adopter associado a essa pessoa (AdopterService.findByPersonId)
    //      1.1.2.1. Se existir
    //        1.1.2.1. Alterar os dados do adopter (método AdopterService.update)
    //        1.1.2.2. Alterar os dados da pessoa (método PersonService.update)
    //        1.1.2.3. Alterar os dados do endereço (método AddressService.update)
    //        1.1.2.4. Retornar o adopter atualizado
    // 2. Verificar se person não está vazia
    //  2.1. Se person não estiver vazia
    //    2.1.1. Alterar os dados da pessoa (método PersonService.update)
    //    2.1.2. Alterar os dados do endereço (método AddressService.update)
    //  2.2. Se person estiver vazia
    //    2.2.1. Criar um novo endereço (método AddressService.create)
    //    2.2.2. criar uma nova pessoa (método PersonService.create)
    // 3. Criar um novo adopter (método AdopterRepository.create)

    const normalizedCpfCnpj = body.person.cpfCnpj.replace(/\D/g, "").slice(0, 20);

    let person = await this.personService.findByCpfCnpj(normalizedCpfCnpj);
    if (person) {
      const adopter = await this.findByPersonId(person.id);

      if (adopter) {
        return this.update(adopter.id, body);
      }
    }

    if (person) {
      const address = await this.addressService.getOne(person.addressId);
      if (address) {
        await this.addressService.update(address.id, {
          state: body.person.address.state,
          city: body.person.address.city,
          district: body.person.address.district,
          street: body.person.address.street,
          number: body.person.address.number ?? "",
          postalCode: body.person.address.postalCode.replace(/\D/g, "").slice(0, 8),
        });
      } else {
        throw new NotFoundException("Endereço da pessoa não encontrado");
      }
    } else {
      const address = await this.addressService.create({
        countryCode: "BR",
        state: body.person.address.state,
        city: body.person.address.city,
        district: body.person.address.district,
        street: body.person.address.street,
        number: body.person.address.number ?? "",
        postalCode: body.person.address.postalCode.replace(/\D/g, "").slice(0, 8),
      });

      const newPerson = await this.personService.create({
        name: body.person.name,
        personType: body.person.personType,
        cpfCnpj: normalizedCpfCnpj,
        addressId: address.id,
      });

      person = newPerson;
    }

    const adopter = this.adopterRepository.create({
      birthDate: body.birthDate ? new Date(body.birthDate) : new Date(),
      notes: body.notes,
      email: body.email,
      phone: body.phone,
      socialNetwork: body.socialNetwork,
      personId: person.id,
    });

    return this.adopterRepository.save(adopter);
  }

  async update(id: number, body: UpdateAdopterDto): Promise<Adopter> {
    // 1. Buscar adotante pelo id (const adopter)
    //  1.1. Se não existir
    //    1.1.1 Lançar NotFoundException
    // 2. Buscar pessoa vinculada ao adotante (const person)
    // 3. Verificar se body.person.cpfCnpj não está vazio
    //  2.1. Se body.person.cpfCnpj não estiver vazio
    //    2.1.1. Buscar pessoa pelo CPF/CNPJ (const existingPerson)
    //    2.1.2. Se existingPerson existir e existingPerson.id for diferente de person.id
    //      2.1.2.1. Alterar adopter.personId para existingPerson.id
    //    2.1.3. Alterar os dados da pessoa (método PersonService.update)
    //    2.1.4. Alterar os dados do endereço (método AddressService.update)
    //  2.2. Se body.person.cpfCnpj estiver vazio
    //    2.2.1. Lançar BadRequestException informando que o CPF/CNPJ é obrigatório
    // 4. Alterar os dados do adotante (método AdopterRepository.merge)

    const adopter = await this.getOne(id);
    if (!adopter) {
      throw new NotFoundException("Adotante não encontrado");
    }

    const person = await this.personService.getOne(adopter.personId);

    if (body.person?.cpfCnpj) {
      const normalizedCpfCnpj = body.person.cpfCnpj.replace(/\D/g, "").slice(0, 20);
      const existingPerson = await this.personService.findByCpfCnpj(normalizedCpfCnpj);

      if (existingPerson && existingPerson.id !== person.id) {
        adopter.personId = existingPerson.id;
      }

      await this.personService.update(adopter.personId, {
        name: body.person.name,
        personType: body.person.personType,
      });

      await this.addressService.update(person.addressId, {
        state: body.person.address.state,
        city: body.person.address.city,
        district: body.person.address.district,
        street: body.person.address.street,
        number: body.person.address.number ?? "",
        postalCode: body.person.address.postalCode.replace(/\D/g, "").slice(0, 8),
      });
    } else {
      throw new BadRequestException("CPF/CNPJ é obrigatório");
    }

    this.adopterRepository.merge(adopter, {
      birthDate: body.birthDate ? new Date(body.birthDate) : new Date(),
      notes: body.notes,
      email: body.email,
      phone: body.phone,
      socialNetwork: body.socialNetwork,
    });

     return this.adopterRepository.save(adopter);
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
      relations: ["person"]
    });
  }

  async getOne(id: number) {
    const adopter = await this.adopterRepository.findOne({
      where: { id },
      relations: ["person"]
    });

    if (!adopter) {
      throw new NotFoundException("Adotante não encontrado");
    }

    return adopter;
  }

  async findByPersonId(personId: number): Promise<Adopter | null> {
    const adopter = await this.adopterRepository.findOne({
      where: { personId },
      relations: ["person"]
    });
    return adopter;
  }
}
