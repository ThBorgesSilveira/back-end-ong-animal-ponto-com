import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SponsorAnimal } from "./entities/sponsor-animal.entity";
import { CreateSponsorAnimalDto } from "./dto/create-sponsor-animal.dto";
import { UpdateSponsorAnimalDto } from "./dto/update-sponsor-animal.dto";
import { SponsorService } from "../sponsor/sponsor.service";
import { AnimalService } from "../animal/animal.service";

@Injectable()
export class SponsorAnimalService {
  constructor(
    @InjectRepository(SponsorAnimal)
    private readonly sponsorAnimalRepository: Repository<SponsorAnimal>,
    private readonly sponsorService: SponsorService,
    private readonly animalService: AnimalService
  ) {}

  async create(body: CreateSponsorAnimalDto): Promise<SponsorAnimal> {
    const sponsor = await this.sponsorService.getOne(body.sponsorId);
    if (!sponsor) {
      throw new NotFoundException("Padrinho não encontrado");
    }

    const animal = await this.animalService.getOne(body.animalId);
    if (!animal) {
      throw new NotFoundException("Animal não encontrado");
    }

    const sponsorAnimal = this.sponsorAnimalRepository.create(body);
    return this.sponsorAnimalRepository.save(sponsorAnimal);
  }

  async update(id: number, body: UpdateSponsorAnimalDto): Promise<SponsorAnimal> {
    const sponsorAnimal = await this.sponsorAnimalRepository.findOne({
      where: { id }
    });

    if (!sponsorAnimal) {
      throw new NotFoundException("Relação padrinho-animal não encontrada");
    }

    if (body.sponsorId !== undefined) {
      const sponsor = await this.sponsorService.getOne(body.sponsorId);
      if (!sponsor) {
        throw new NotFoundException("Padrinho não encontrado");
      }
    }

    if (body.animalId !== undefined) {
      const animal = await this.animalService.getOne(body.animalId);
      if (!animal) {
        throw new NotFoundException("Animal não encontrado");
      }
    }

    const updated = this.sponsorAnimalRepository.merge(sponsorAnimal, body);
    return this.sponsorAnimalRepository.save(updated);
  }

  async delete(id: number) {
    const sponsorAnimal = await this.sponsorAnimalRepository.findOne({
      where: { id }
    });

    if (!sponsorAnimal) {
      throw new NotFoundException("Relação padrinho-animal não encontrada");
    }

    await this.sponsorAnimalRepository.softDelete(id);

    return { message: "Relação removida com sucesso" };
  }

  async getAll() {
    return this.sponsorAnimalRepository.find({
      relations: ["sponsor", "animal"]
    });
  }

  async getOne(id: number) {
    const sponsorAnimal = await this.sponsorAnimalRepository.findOne({
      where: { id },
      relations: ["sponsor", "animal"]
    });

    if (!sponsorAnimal) {
      throw new NotFoundException("Relação padrinho-animal não encontrada");
    }

    return sponsorAnimal;
  }
}
