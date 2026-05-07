import { Module } from '@nestjs/common';
import { SponsorAnimalService } from './sponsor-animal.service';
import { SponsorAnimalController } from './sponsor-animal.controller';
import { SponsorAnimal } from './entities/sponsor-animal.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SponsorModule } from '../sponsor/sponsor.module';
import { AnimalModule } from '../animal/animal.module';

@Module({
  imports: [TypeOrmModule.forFeature([SponsorAnimal]),
            SponsorModule,
            AnimalModule],
  controllers: [SponsorAnimalController],
  providers: [SponsorAnimalService],
})
export class SponsorAnimalModule {}
