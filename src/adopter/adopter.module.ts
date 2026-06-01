import { Module } from '@nestjs/common';
import { AdopterService } from './adopter.service';
import { AdopterController } from './adopter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Adopter } from './entities/adopter.entity';
import { PersonModule } from '../person/person.module';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [TypeOrmModule.forFeature([Adopter]),
            PersonModule,
            AddressModule],
  controllers: [AdopterController],
  providers: [AdopterService],
})
export class AdopterModule {}
