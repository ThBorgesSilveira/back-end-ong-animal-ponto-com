import { Module } from '@nestjs/common';
import { VolunteerService } from './volunteer.service';
import { VolunteerController } from './volunteer.controller';
import { Volunteer } from './entities/volunteer.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { PersonModule } from '../person/person.module';

@Module({
  imports: [TypeOrmModule.forFeature([Volunteer]),
              PersonModule],
  controllers: [VolunteerController],
  providers: [VolunteerService],
})
export class VolunteerModule {}
