import { Module } from '@nestjs/common';
import { AdopterService } from './adopter.service';
import { AdopterController } from './adopter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Adopter } from './entities/adopter.entity';
import { PersonModule } from '../person/person.module';

@Module({
  imports: [TypeOrmModule.forFeature([Adopter]),
            PersonModule],
  controllers: [AdopterController],
  providers: [AdopterService],
})
export class AdopterModule {}
