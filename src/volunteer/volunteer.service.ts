import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Volunteer } from "./entities/volunteer.entity";
import { PersonService } from "../person/person.service";
import { CreateVolunteerDto } from "./dto/create-volunteer.dto";
import { UpdateVolunteerDto } from "./dto/update-volunteer.dto";

@Injectable()
export class VolunteerService {
  constructor(
    @InjectRepository(Volunteer)
    private readonly volunteerRepository: Repository<Volunteer>,
    private readonly personService: PersonService
  ) {}

  async create(body: CreateVolunteerDto): Promise<Volunteer> {
    const person = await this.personService.getOne(body.personId);

    if (!person) {
      throw new NotFoundException("Pessoa não encontrada");
    }

    const volunteer = this.volunteerRepository.create({
      ...body,
      person,
    });

    return this.volunteerRepository.save(volunteer);
  }

  async update(id: number, body: UpdateVolunteerDto): Promise<Volunteer> {
    const volunteer = await this.volunteerRepository.findOne({
      where: { id },
      relations: ["person"],
    });

    if (!volunteer) {
      throw new NotFoundException("Voluntário não encontrado");
    }

    if (body.personId !== undefined) {
      const person = await this.personService.getOne(body.personId);

      if (!person) {
        throw new NotFoundException("Pessoa não encontrada");
      }

      volunteer.person = person;
    }

    const updatedVolunteer = this.volunteerRepository.merge(volunteer, body);
    return this.volunteerRepository.save(updatedVolunteer);
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
}
