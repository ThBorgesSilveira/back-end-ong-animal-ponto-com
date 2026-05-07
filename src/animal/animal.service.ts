import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Animal } from "./entities/animal.entity";
import { CreateAnimalDto } from "./dto/create-animal.dto";
import { UpdateAnimalDto } from "./dto/update-animal.dto";

@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
  ) {}

  async create(body: CreateAnimalDto): Promise<Animal> {
    const animal = this.animalRepository.create(body);
    return this.animalRepository.save(animal);
  }

  async update(id: number, body: UpdateAnimalDto): Promise<Animal> {
    const animal = await this.animalRepository.findOne({
      where: { id }
    });

    if (!animal) {
      throw new NotFoundException('Animal não encontrado');
    }

    const updatedAnimal = this.animalRepository.merge(animal, body);
    return this.animalRepository.save(updatedAnimal);
  }

  async delete(id: number) {
    const animal = await this.animalRepository.findOne({ where: { id } });

    if (!animal) {
      throw new NotFoundException('Animal não encontrado');
    }

    await this.animalRepository.softDelete(id);

    return { message: 'Animal removido com sucesso' };
  }

  async getAll() {
    return this.animalRepository.find();
  }

  async getOne(id: number) {
    const animal = await this.animalRepository.findOne({
      where: { id }
    });

    if (!animal) {
      throw new NotFoundException('Animal não encontrado');
    }

    return animal;
  }
}
