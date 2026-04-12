import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Partner } from "./entities/partner.entity";
import { CreatePartnerDto } from "./dto/create-partner.dto";
import { UpdatePartnerDto } from "./dto/update-partner.dto";
import { PersonService } from "../person/person.service";

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
    private readonly personService: PersonService
  ) {}

  async create(body: CreatePartnerDto): Promise<Partner> {
    const person = await this.personService.getOne(body.personId);

    if (!person) {
      throw new NotFoundException("Pessoa não encontrada");
    }

    const partner = this.partnerRepository.create(body);
    return this.partnerRepository.save(partner);
  }

  async update(id: number, body: UpdatePartnerDto): Promise<Partner> {
    const partner = await this.partnerRepository.findOne({
      where: { id }
    });

    if (!partner) {
      throw new NotFoundException("Parceiro não encontrado");
    }

    if (body.personId !== undefined) {
      const person = await this.personService.getOne(body.personId);

      if (!person) {
        throw new NotFoundException("Pessoa não encontrada");
      }
    }

    const updatedPartner = this.partnerRepository.merge(partner, body);
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
