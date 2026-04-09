import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScheduleEventService } from './schedule-event.service';
import { CreateScheduleEventDto } from './dto/create-schedule-event.dto';
import { UpdateScheduleEventDto } from './dto/update-schedule-event.dto';

@Controller('schedule-event')
export class ScheduleEventController {
  constructor(private readonly scheduleEventService: ScheduleEventService) {}

  @Post()
  create(@Body() Body: CreateScheduleEventDto) {
    return this.scheduleEventService.create(Body);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() body: UpdateScheduleEventDto) {
    return this.scheduleEventService.update(+id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.scheduleEventService.delete(+id);
  }

  @Get('all')
  async getAll() {
    return this.scheduleEventService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.scheduleEventService.getOne(+id);
  }
}
