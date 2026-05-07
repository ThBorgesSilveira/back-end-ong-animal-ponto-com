import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  if (process.env.RUN_SEED_ON_BOOT === 'true') {
    const seedService = app.get(SeedService);
    await seedService.runAnimalSeed();
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
