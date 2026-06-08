import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Volunteer } from "./entities/volunteer.entity";
import { PersonService } from "../person/person.service";
import { CreateVolunteerDto } from "./dto/create-volunteer.dto";
import { UpdateVolunteerDto } from "./dto/update-volunteer.dto";
import { AddressService } from "../address/address.service";

@Injectable()
export class VolunteerService {
  constructor(
    @InjectRepository(Volunteer)
    private readonly volunteerRepository: Repository<Volunteer>,
    private readonly personService: PersonService,
    private readonly addressService: AddressService
  ) {}

  async create(body: CreateVolunteerDto): Promise<Volunteer> {
    // 1. Verificar se já existe uma pessoa com o mesmo CPF/CNPJ (const person)
    //  1.1. Se existir
    //    1.1.2. Verificar se existe um voluntário associado a essa pessoa (VolunteerService.findByPersonId)
    //      1.1.2.1. Se existir
    //        1.1.2.1. Alterar os dados do voluntário (método VolunteerService.update)
    //        1.1.2.2. Alterar os dados da pessoa (método PersonService.update)
    //        1.1.2.3. Alterar os dados do endereço (método AddressService.update)
    //        1.1.2.4. Retornar o voluntário atualizado
    // 2. Verificar se person não está vazia
    //  2.1. Se person não estiver vazia
    //    2.1.1. Alterar os dados da pessoa (método PersonService.update)
    //    2.1.2. Alterar os dados do endereço (método AddressService.update)
    //  2.2. Se person estiver vazia
    //    2.2.1. Criar um novo endereço (método AddressService.create)
    //    2.2.2. criar uma nova pessoa (método PersonService.create)
    // 3. Criar um novo voluntário (método VolunteerRepository.create)

    const normalizedCpfCnpj = body.person.cpfCnpj.replace(/\D/g, "").slice(0, 20);

    let person = await this.personService.findByCpfCnpj(normalizedCpfCnpj);
    if (person) {
      const volunteer = await this.findByPersonId(person.id);

      if (volunteer) {
        return this.update(volunteer.id, body);
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
      }else {
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
    
    const volunteer = this.volunteerRepository.create({
      birthDate: body.birthDate,
      notes: body.notes,
      isActive: body.isActive ?? true,
      person,
    });

    return this.volunteerRepository.save(volunteer);
  }

  async update(id: number, body: UpdateVolunteerDto): Promise<Volunteer> {
    // 1. Buscar voluntário pelo id (const partner)
    //  1.1. Se não existir
    //    1.1.1 Lançar NotFoundException
    // 2. Buscar pessoa vinculada ao voluntário (const person)
    // 3. Verificar se body.person.cpfCnpj não está vazio
    //  2.1. Se body.person.cpfCnpj não estiver vazio
    //    2.1.1. Buscar pessoa pelo CPF/CNPJ (const existingPerson)
    //    2.1.2. Se existingPerson existir e existingPerson.id for diferente de person.id
    //      2.1.2.1. Alterar partner.personId para existingPerson.id
    //    2.1.3. Alterar os dados da pessoa (método PersonService.update)
    //    2.1.4. Alterar os dados do endereço (método AddressService.update)
    //  2.2. Se body.person.cpfCnpj estiver vazio
    //    2.2.1. Lançar BadRequestException informando que o CPF/CNPJ é obrigatório
    // 4. Alterar os dados do voluntário (método VolunteerRepository.merge)

    const volunteer = await this.getOne(id);
    if (!volunteer) {
      throw new NotFoundException("Voluntário não encontrado");
    }

    const person = await this.personService.getOne(volunteer.personId);

    if (body.person?.cpfCnpj) {
      const normalizedCpfCnpj = body.person.cpfCnpj.replace(/\D/g, "").slice(0, 20);
      const existingPerson = await this.personService.findByCpfCnpj(normalizedCpfCnpj);

      if (existingPerson && existingPerson.id !== person.id) {
        volunteer.personId = existingPerson.id;
      }

      await this.personService.update(volunteer.personId, {
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

    this.volunteerRepository.merge(volunteer, {
      birthDate: body.birthDate,
      notes: body.notes,
      isActive: body.isActive,
    });

    return this.volunteerRepository.save(volunteer);
  }

  async delete(id: number) {
    const volunteer = await this.volunteerRepository.findOne({
      where: { id },
    });

    if (!volunteer) {
      throw new NotFoundException("Voluntário não encontrado");
    }

    await this.volunteerRepository.softDelete(id);

    return { message: "Voluntário removido com sucesso" };
  }

  async getAll() {
    return this.volunteerRepository.find({
      relations: ["person"],
    });
  }

  async getOne(id: number) {
    const volunteer = await this.volunteerRepository.findOne({
      where: { id },
      relations: ["person"],
    });

    if (!volunteer) {
      throw new NotFoundException("Voluntário não encontrado");
    }

    return volunteer;
  }

  async findByPersonId(personId: number): Promise<Volunteer | null> {
    const volunteer = await this.volunteerRepository.findOne({
      where: { personId },
      relations: ["person"],
    });
    return volunteer;
  }
}
