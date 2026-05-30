import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Partner } from "./entities/partner.entity";
import { CreatePartnerDto, CreatePartnerPersonDto } from "./dto/create-partner.dto";
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

  private normalizeCpf(cpfCnpj: string) {
    return cpfCnpj.replace(/\D/g, "").slice(0, 20);
  }

  private async resolveAddress(address: CreatePartnerPersonDto["address"]) {
    const normalizedPostalCode = address.postalCode.replace(/\D/g, "").slice(0, 8);

    const addressPayload: CreateAddressDto = {
      countryCode: "BR",
      state: address.state,
      city: address.city,
      district: address.district,
      street: address.street,
      number: address.number ?? "",
      postalCode: normalizedPostalCode,
    };

    const existingAddressId = await this.addressService.findByFields(addressPayload);
    if (existingAddressId) return existingAddressId;

    const createdAddress = await this.addressService.create(addressPayload);
    return createdAddress.id;
  }

  async create(body: CreatePartnerDto): Promise<Partner> {
    const normalizedCpfCnpj = this.normalizeCpf(body.person.cpfCnpj);
    const addressId = await this.resolveAddress(body.person.address);

    const existingPersonId = await this.personService.findByCpfCnpj(normalizedCpfCnpj);
    const existingPartner = existingPersonId
      ? await this.partnerRepository.findOne({ where: { personId: existingPersonId } })
      : null;

    if (existingPartner) {
      const updatedPartner = await this.partnerRepository.merge(existingPartner, {
        corporateName: body.corporateName,
        tradeName: body.tradeName,
        notes: body.notes,
        isActive: body.isActive,
      });

      await this.personService.update(existingPartner.personId, {
        name: body.person.name,
        personType: "FISICA",
        cpfCnpj: normalizedCpfCnpj,
        addressId,
      });

      return this.partnerRepository.save(updatedPartner);
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

    if (!partner) throw new NotFoundException("Parceiro nao encontrado");

    if (body.person) {
      const currentPerson = await this.personService.getOne(partner.personId);
      const normalizedCpfCnpj = body.person.cpfCnpj
        ? this.normalizeCpf(body.person.cpfCnpj)
        : currentPerson.cpfCnpj;

      let addressId = currentPerson.addressId;

      if (body.person.address) {
        addressId = await this.resolveAddress(body.person.address);
      }

      await this.personService.update(partner.personId, {
        name: body.person.name ?? currentPerson.name,
        personType: "FISICA",
        cpfCnpj: normalizedCpfCnpj,
        addressId,
      });
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
      throw new NotFoundException("Parceiro nao encontrado");
    }

    await this.partnerRepository.softDelete(id);

    return { message: "Parceiro removido com sucesso" };
  }

  async getAll() {
    return this.partnerRepository.find({
      relations: ["person", "person.address"],
    });
  }

  async getOne(id: number) {
    const partner = await this.partnerRepository.findOne({
      where: { id },
      relations: ["person", "person.address"],
    });

    if (!partner) {
      throw new NotFoundException("Parceiro nao encontrado");
    }

    return partner;
  }
}
