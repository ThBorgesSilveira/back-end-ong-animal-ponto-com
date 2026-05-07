import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Animal } from '../animal/entities/animal.entity';

type SeedAnimal = {
  name: string;
  size: string;
  temperament: string;
  notes: string;
  birthDate?: string;
  rescueDate?: string;
};

const animalsToSeed: SeedAnimal[] = [
  {
    name: 'Rex',
    size: 'Medio',
    temperament: 'Brincalhao e carinhoso',
    notes: 'Animal usado no formulario de adocao regular e surpresa.',
    birthDate: '2025-02-01',
    rescueDate: '2025-03-15',
  },
  {
    name: 'Luna',
    size: 'Pequeno',
    temperament: 'Docil e brincalhona',
    notes: 'Animal usado no formulario de adocao regular e surpresa.',
    birthDate: '2025-03-01',
    rescueDate: '2025-04-10',
  },
  {
    name: 'Thor',
    size: 'Grande',
    temperament: 'Protetor e leal',
    notes: 'Animal usado no formulario de adocao regular.',
    birthDate: '2024-05-01',
    rescueDate: '2025-01-20',
  },
  {
    name: 'Nina',
    size: 'Medio',
    temperament: 'Tranquila e carinhosa',
    notes: 'Animal usado no formulario de adocao regular e surpresa.',
    birthDate: '2024-11-15',
    rescueDate: '2025-04-20',
  },
  {
    name: 'Bidu',
    size: 'Pequeno',
    temperament: 'Brincalhao',
    notes: 'Animal usado no formulario de adocao regular.',
    birthDate: '2025-01-10',
    rescueDate: '2025-02-25',
  },
];

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const dataSource = app.get(DataSource);
    const animalRepository = dataSource.getRepository(Animal);

    let created = 0;
    let skipped = 0;

    for (const item of animalsToSeed) {
      const existing = await animalRepository.findOne({
        where: { name: item.name },
      });

      if (existing) {
        skipped += 1;
        continue;
      }

      const animal = animalRepository.create({
        name: item.name,
        size: item.size,
        temperament: item.temperament,
        notes: item.notes,
        birthDate: item.birthDate ? new Date(item.birthDate) : undefined,
        rescueDate: item.rescueDate ? new Date(item.rescueDate) : undefined,
      });

      await animalRepository.save(animal);
      created += 1;
    }

    console.log(
      `[seed:animals] concluido | criados: ${created} | ignorados (ja existentes): ${skipped}`,
    );
  } finally {
    await app.close();
  }
}

run().catch((error) => {
  console.error('[seed:animals] erro ao executar seed:', error);
  process.exit(1);
});
