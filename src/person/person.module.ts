import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { Person } from './entities/person.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [TypeOrmModule.forFeature([Person]),
              AddressModule],
  controllers: [PersonController],
  providers: [PersonService],
  exports: [PersonService],
})
export class PersonModule {}
