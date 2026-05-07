import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AdoptionRequest, EnumAdoptionRequestStatus } from "./entities/adoption-request.entity";
import { CreateAdoptionRequestDto } from "./dto/create-adoption-request.dto";
import { UpdateAdoptionRequestDto } from "./dto/update-adoption-request.dto";
import { PersonService } from "../person/person.service";
import { AnimalService } from "../animal/animal.service";

@Injectable()
export class AdoptionRequestService {
  constructor(
    @InjectRepository(AdoptionRequest)
    private readonly adoptionRequestRepository: Repository<AdoptionRequest>,
    private readonly personService: PersonService,
    private readonly animalService: AnimalService
  ) {}

  async create(body: CreateAdoptionRequestDto): Promise<AdoptionRequest> {
    const person = await this.personService.getOne(body.personId);
    if (!person) {
      throw new NotFoundException("Pessoa não encontrada");
    }

    const animal = await this.animalService.getOne(body.animalId);
    if (!animal) {
      throw new NotFoundException("Animal não encontrado");
    }

    const request = this.adoptionRequestRepository.create({
      ...body,
      status: body.status ?? EnumAdoptionRequestStatus.PENDING,
    });

    return this.adoptionRequestRepository.save(request);
  }

  async update(id: number, body: UpdateAdoptionRequestDto): Promise<AdoptionRequest> {
    const request = await this.adoptionRequestRepository.findOne({
      where: { id }
    });

    if (!request) {
      throw new NotFoundException("Solicitação de adoção não encontrada");
    }

    if (body.personId !== undefined) {
      const person = await this.personService.getOne(body.personId);
      if (!person) {
        throw new NotFoundException("Pessoa não encontrada");
      }
    }

    if (body.animalId !== undefined) {
      const animal = await this.animalService.getOne(body.animalId);
      if (!animal) {
        throw new NotFoundException("Animal não encontrado");
      }
    }

    const updated = this.adoptionRequestRepository.merge(request, body);
    return this.adoptionRequestRepository.save(updated);
  }

  async delete(id: number) {
    const request = await this.adoptionRequestRepository.findOne({
      where: { id }
    });

    if (!request) {
      throw new NotFoundException("Solicitação de adoção não encontrada");
    }

    await this.adoptionRequestRepository.softDelete(id);

    return { message: "Solicitação de adoção removida com sucesso" };
  }

  async getAll() {
    return this.adoptionRequestRepository.find({
      relations: ["person", "animal"]
    });
  }

  async getOne(id: number) {
    const request = await this.adoptionRequestRepository.findOne({
      where: { id },
      relations: ["person", "animal"]
    });

    if (!request) {
      throw new NotFoundException("Solicitação de adoção não encontrada");
    }

    return request;
  }
}
