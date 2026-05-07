import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Adopter } from "./entities/adopter.entity";
import { CreateAdopterDto } from "./dto/create-adopter.dto";
import { UpdateAdopterDto } from "./dto/update-adopter.dto";
import { PersonService } from "../person/person.service";

@Injectable()
export class AdopterService {
  constructor(
    @InjectRepository(Adopter)
    private readonly adopterRepository: Repository<Adopter>,
    private readonly personService: PersonService
  ) {}

  async create(body: CreateAdopterDto): Promise<Adopter> {
    const person = await this.personService.getOne(body.personId);

    if (!person) {
      throw new NotFoundException("Pessoa não encontrada");
    }

    const adopter = this.adopterRepository.create(body);
    return this.adopterRepository.save(adopter);
  }

  async update(id: number, body: UpdateAdopterDto): Promise<Adopter> {
    const adopter = await this.adopterRepository.findOne({
      where: { id }
    });

    if (!adopter) {
      throw new NotFoundException("Adotante não encontrado");
    }

    if (body.personId !== undefined) {
      const person = await this.personService.getOne(body.personId);

      if (!person) {
        throw new NotFoundException("Pessoa não encontrada");
      }
    }

    const updatedAdopter = this.adopterRepository.merge(adopter, body);
    return this.adopterRepository.save(updatedAdopter);
  }

  async delete(id: number) {
    const adopter = await this.adopterRepository.findOne({
      where: { id }
    });

    if (!adopter) {
      throw new NotFoundException("Adotante não encontrado");
    }

    await this.adopterRepository.softDelete(id);

    return { message: "Adotante removido com sucesso" };
  }

  async getAll() {
    return this.adopterRepository.find({
      relations: ["person"]
    });
  }

  async getOne(id: number) {
    const adopter = await this.adopterRepository.findOne({
      where: { id },
      relations: ["person"]
    });

    if (!adopter) {
      throw new NotFoundException("Adotante não encontrado");
    }

    return adopter;
  }
}
