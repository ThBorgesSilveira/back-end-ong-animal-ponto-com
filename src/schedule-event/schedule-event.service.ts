import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleEventDto } from './dto/create-schedule-event.dto';
import { UpdateScheduleEventDto } from './dto/update-schedule-event.dto';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { ScheduleEvent } from './entities/schedule-event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleEventService {
  constructor(
    @InjectRepository(ScheduleEvent)
    private readonly scheduleEventRepository: Repository<ScheduleEvent>,
  ) {}
  
  async create(body: CreateScheduleEventDto): Promise<ScheduleEvent> {
    const scheduleEvent = this.scheduleEventRepository.create(body);
    return this.scheduleEventRepository.save(scheduleEvent);
  }

  async update(id: number, body: UpdateScheduleEventDto) {
    const scheduleEvent = await this.scheduleEventRepository.findOne({
      where: { id }
    })

    if(!scheduleEvent) throw new NotFoundException('Evento não encontrado');

    const updateScheduleEvent = await this.scheduleEventRepository.merge(scheduleEvent, body);

    return await this.scheduleEventRepository.save(updateScheduleEvent);
  }

  async delete(id: number) {
    const scheduleEvent = await this.scheduleEventRepository.findOne({ where: { id } });

    if (!scheduleEvent) {
      throw new NotFoundException('Evento não encontrado');
    }

    await this.scheduleEventRepository.softDelete(id);

    return { message: 'Evento removido com sucesso' };
  }


  async getAll() {
    const scheduleEvents = await this.scheduleEventRepository.find({
      relations: ['address']
    });
    return scheduleEvents;
  }

  async getOne(id: number){
    const scheduleEvent = await this.scheduleEventRepository.findOne({
      where: { id },
      relations: ['address']
    })

    if(!scheduleEvent) throw new NotFoundException('Evento não encontrado');

    return scheduleEvent;
  }
}
