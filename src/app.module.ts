import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AddressController } from './address/address.controller';

@Module({
  imports: [AddressController],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
