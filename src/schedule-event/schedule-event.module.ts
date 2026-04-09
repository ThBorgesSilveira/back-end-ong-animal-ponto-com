import { Module } from '@nestjs/common';
import { ScheduleEventService } from './schedule-event.service';
import { ScheduleEventController } from './schedule-event.controller';
import { ScheduleEvent } from './entities/schedule-event.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleEvent])],
  controllers: [ScheduleEventController],
  providers: [ScheduleEventService],
})
export class ScheduleEventModule {}
