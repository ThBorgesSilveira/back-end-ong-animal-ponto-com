import { Module } from '@nestjs/common';
import { ScheduleEventService } from './schedule-event.service';
import { ScheduleEventController } from './schedule-event.controller';
import { ScheduleEvent } from './entities/schedule-event.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleEvent]),
            AddressModule],
  controllers: [ScheduleEventController],
  providers: [ScheduleEventService],
})
export class ScheduleEventModule {}
