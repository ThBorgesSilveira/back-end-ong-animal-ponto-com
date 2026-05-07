import { Module } from '@nestjs/common';
import { AdoptionRequestService } from './adoption-request.service';
import { AdoptionRequestController } from './adoption-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonModule } from '../person/person.module';
import { AnimalModule } from '../animal/animal.module';
import { AdoptionRequest } from './entities/adoption-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdoptionRequest]),
            PersonModule,
            AnimalModule],
  controllers: [AdoptionRequestController],
  providers: [AdoptionRequestService],
})
export class AdoptionRequestModule {}
