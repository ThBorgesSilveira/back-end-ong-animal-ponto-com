import { Module } from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { SponsorController } from './sponsor.controller';
import { Sponsor } from './entities/sponsor.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { PersonModule } from '../person/person.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sponsor]),
            PersonModule],
  controllers: [SponsorController],
  providers: [SponsorService],
})
export class SponsorModule {}
