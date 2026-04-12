import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { Partner } from './entities/partner.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { PersonModule } from '../person/person.module';

@Module({
  imports: [TypeOrmModule.forFeature([Partner]),
            PersonModule],
  controllers: [PartnerController],
  providers: [PartnerService],
})
export class PartnerModule {}
