import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from './address/address.module';
import { ScheduleEventModule } from './schedule-event/schedule-event.module';
import { PersonModule } from './person/person.module';
import { VolunteerModule } from './volunteer/volunteer.module';
import { AnimalModule } from './animal/animal.module';
import { PartnerModule } from './partner/partner.module';
import { SponsorModule } from './sponsor/sponsor.module';
import { SponsorAnimalModule } from './sponsor-animal/sponsor-animal.module';
import { DonationModule } from './donation/donation.module';
import { AdopterModule } from './adopter/adopter.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'animalpontocom',
      autoLoadEntities: true,
      synchronize: true,
      logging: true
    }),
    AddressModule,
    ScheduleEventModule,
    PersonModule,
    VolunteerModule,
    AnimalModule,
    PartnerModule,
    SponsorModule,
    SponsorAnimalModule,
    DonationModule,
    AdopterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
