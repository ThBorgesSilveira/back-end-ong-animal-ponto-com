import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
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
      personType: "FISICA",
      cpfCnpj: normalizedCpfCnpj,
      addressId,
    });

    const partner = this.partnerRepository.create({
      personId: person.id,
      corporateName: body.corporateName,
      tradeName: body.tradeName,
      notes: body.notes,
      isActive: body.isActive,
    });

    return this.partnerRepository.save(partner);
  }

  async update(id: number, body: UpdatePartnerDto): Promise<Partner> {
    const partner = await this.partnerRepository.findOne({ where: { id } });

    if (!partner) throw new NotFoundException("Parceiro não encontrado");

    if (body.person?.cpfCnpj) {
      const normalizedCpfCnpj = body.person.cpfCnpj.replace(/\D/g, "").slice(0, 20);

      const personId = await this.personService.findByCpfCnpj(normalizedCpfCnpj);

      if (!personId) {
        throw new NotFoundException(`Pessoa com CPF/CNPJ ${normalizedCpfCnpj} não encontrada`);
      }

      if (personId !== partner.personId) {
        partner.personId = personId;
      }
    }

    const updatedPartner = this.partnerRepository.merge(partner, {
      corporateName: body.corporateName,
      tradeName: body.tradeName,
      notes: body.notes,
      isActive: body.isActive,
    });

    return this.partnerRepository.save(updatedPartner);
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
      relations: ["person"]
    });
  }

  async getOne(id: number) {
    const partner = await this.partnerRepository.findOne({
      where: { id },
      relations: ["person"]
    });

    if (!partner) {
      throw new NotFoundException("Parceiro não encontrado");
    }

    return partner;
  }
}
