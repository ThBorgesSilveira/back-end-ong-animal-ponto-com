import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Partner } from "./entities/partner.entity";
import { CreatePartnerDto } from "./dto/create-partner.dto";
import { UpdatePartnerDto } from "./dto/update-partner.dto";
import { PersonService } from "../person/person.service";
import { AddressService } from "../address/address.service";
import { CreateAddressDto } from "../address/dto/create-address.dto";

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
    private readonly personService: PersonService,
		private readonly addressService: AddressService
  ) {}

  async create(body: CreatePartnerDto): Promise<Partner> {
    // 1. Verificar se já existe uma pessoa com o mesmo CPF/CNPJ (const person)
    //  1.1. Se existir
    //    1.1.2. Verificar se existe um parceiro associado a essa pessoa (PartnerService.findByPersonId)
    //      1.1.2.1. Se existir
    //        1.1.2.1. Alterar os dados do parceiro (método PartnerService.update)
    //        1.1.2.2. Alterar os dados da pessoa (método PersonService.update)
    //        1.1.2.3. Alterar os dados do endereço (método AddressService.update)
    //        1.1.2.4. Retornar o parceiro atualizado
    // 2. Verificar se person não está vazia
    //  2.1. Se person não estiver vazia
    //    2.1.1. Alterar os dados da pessoa (método PersonService.update)
    //    2.1.2. Alterar os dados do endereço (método AddressService.update)
    //  2.2. Se person estiver vazia
    //    2.2.1. Criar um novo endereço (método AddressService.create)
    //    2.2.2. criar uma nova pessoa (método PersonService.create)
    // 3. Criar um novo parceiro (método PartnerRepository.create)

    const normalizedCpfCnpj = body.person.cpfCnpj.replace(/\D/g, "").slice(0, 20);

    let person = await this.personService.findByCpfCnpj(normalizedCpfCnpj);
    if (person) {
      const partner = await this.findByPersonId(person.id);

      if (partner) {
        return this.update(partner.id, body);
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
    
    const partner = this.partnerRepository.create({
      personId: person.id,
      corporateName: body.corporateName,
      tradeName: body.tradeName,
      notes: body.notes,
      isActive: body.isActive,
      partnershipType: body.partnershipType,
    });

    return this.partnerRepository.save(partner);
  }

  async update(id: number, body: UpdatePartnerDto): Promise<Partner> {
    // 1. Buscar parceiro pelo id (const partner)
    //  1.1. Se não existir
    //    1.1.1 Lançar NotFoundException
    // 2. Buscar pessoa vinculada ao parceiro (const person)
    // 3. Verificar se body.person.cpfCnpj não está vazio
    //  2.1. Se body.person.cpfCnpj não estiver vazio
    //    2.1.1. Buscar pessoa pelo CPF/CNPJ (const existingPerson)
    //    2.1.2. Se existingPerson existir e existingPerson.id for diferente de person.id
    //      2.1.2.1. Alterar partner.personId para existingPerson.id
    //    2.1.3. Alterar os dados da pessoa (método PersonService.update)
    //    2.1.4. Alterar os dados do endereço (método AddressService.update)
    //  2.2. Se body.person.cpfCnpj estiver vazio
    //    2.2.1. Lançar BadRequestException informando que o CPF/CNPJ é obrigatório
    // 4. Alterar os dados do parceiro (método PartnerRepository.merge)

    const partner = await this.getOne(id);
    if (!partner) {
      throw new NotFoundException("Parceiro não encontrado");
    }

    const person = await this.personService.getOne(partner.personId);

    if (body.person?.cpfCnpj) {
      const normalizedCpfCnpj = body.person.cpfCnpj.replace(/\D/g, "").slice(0, 20);
      const existingPerson = await this.personService.findByCpfCnpj(normalizedCpfCnpj);

      if (existingPerson && existingPerson.id !== person.id) {
        partner.personId = existingPerson.id;
      }

      await this.personService.update(partner.personId, {
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

    this.partnerRepository.merge(partner, {
      corporateName: body.corporateName,
      tradeName: body.tradeName,
      notes: body.notes,
      isActive: body.isActive,
      partnershipType: body.partnershipType,
    });

    return this.partnerRepository.save(partner);
  }

  async delete(id: number) {
    const partner = await this.partnerRepository.findOne({ where: { id } });

    if (!partner) {
      throw new NotFoundException("Parceiro não encontrado");
    }

    await this.partnerRepository.softDelete(id);

    return { message: "Parceiro removido com sucesso" };
  }

  async getAll() {
    return this.partnerRepository.find({
      relations: ["person", "person.address"]
    });
  }

  async getOne(id: number) {
    const partner = await this.partnerRepository.findOne({
      where: { id },
      relations: ["person", "person.address"]
    });

    if (!partner) {
      throw new NotFoundException("Parceiro não encontrado");
    }

    return partner;
  }

  async findByPersonId(personId: number): Promise<Partner | null> {
    const partner = await this.partnerRepository.findOne({
      where: { personId },
      relations: ["person", "person.address"]
    });

    return partner;
  }
}
