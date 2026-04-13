import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Sponsor } from "./entities/sponsor.entity";
import { CreateSponsorDto } from "./dto/create-sponsor.dto";
import { UpdateSponsorDto } from "./dto/update-sponsor.dto";
import { PersonService } from "../person/person.service";

@Injectable()
export class SponsorService {
  constructor(
    @InjectRepository(Sponsor)
    private readonly sponsorRepository: Repository<Sponsor>,
    private readonly personService: PersonService
  ) {}

  async create(body: CreateSponsorDto): Promise<Sponsor> {
    const person = await this.personService.getOne(body.personId);

    if (!person) {
      throw new NotFoundException("Pessoa não encontrada");
    }

    const sponsor = this.sponsorRepository.create(body);
    return this.sponsorRepository.save(sponsor);
  }

  async update(id: number, body: UpdateSponsorDto): Promise<Sponsor> {
    const sponsor = await this.sponsorRepository.findOne({
      where: { id }
    });

    if (!sponsor) {
      throw new NotFoundException("Padrinho não encontrado");
    }

    if (body.personId !== undefined) {
      const person = await this.personService.getOne(body.personId);

      if (!person) {
        throw new NotFoundException("Pessoa não encontrada");
      }
    }

    const updatedSponsor = this.sponsorRepository.merge(sponsor, body);
    return this.sponsorRepository.save(updatedSponsor);
  }

  async delete(id: number) {
    const sponsor = await this.sponsorRepository.findOne({ where: { id } });

    if (!sponsor) {
      throw new NotFoundException("Padrinho não encontrado");
    }

    await this.sponsorRepository.softDelete(id);

    return { message: "Padrinho removido com sucesso" };
  }

  async getAll() {
    return this.sponsorRepository.find({
      relations: ["person"]
    });
  }

  async getOne(id: number) {
    const sponsor = await this.sponsorRepository.findOne({
      where: { id },
      relations: ["person"]
    });

    if (!sponsor) {
      throw new NotFoundException("Padrinho não encontrado");
    }

    return sponsor;
  }
}
