import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Donation } from "./entities/donation.entity";
import { CreateDonationDto } from "./dto/create-donation.dto";
import { UpdateDonationDto } from "./dto/update-donation.dto";
import { PersonService } from "../person/person.service";

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,
    private readonly personService: PersonService
  ) {}

  async create(body: CreateDonationDto): Promise<Donation> {
    const person = await this.personService.getOne(body.personId);

    if (!person) {
      throw new NotFoundException("Pessoa não encontrada");
    }

    const donation = this.donationRepository.create(body);
    return this.donationRepository.save(donation);
  }

  async update(id: number, body: UpdateDonationDto): Promise<Donation> {
    const donation = await this.donationRepository.findOne({
      where: { id }
    });

    if (!donation) {
      throw new NotFoundException("Doação não encontrada");
    }

    if (body.personId !== undefined) {
      const person = await this.personService.getOne(body.personId);

      if (!person) {
        throw new NotFoundException("Pessoa não encontrada");
      }
    }

    const updatedDonation = this.donationRepository.merge(donation, body);
    return this.donationRepository.save(updatedDonation);
  }

  async delete(id: number) {
    const donation = await this.donationRepository.findOne({
      where: { id }
    });

    if (!donation) {
      throw new NotFoundException("Doação não encontrada");
    }

    await this.donationRepository.softDelete(id);

    return { message: "Doação removida com sucesso" };
  }

  async getAll() {
    return this.donationRepository.find({
      relations: ["person"]
    });
  }

  async getOne(id: number) {
    const donation = await this.donationRepository.findOne({
      where: { id },
      relations: ["person"]
    });

    if (!donation) {
      throw new NotFoundException("Doação não encontrada");
    }

    return donation;
  }
}
