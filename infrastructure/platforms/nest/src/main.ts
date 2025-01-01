import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationFilter } from './filters/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Préfixe global pour l'API
  app.setGlobalPrefix('api');

  // Filtre global pour les erreurs de validation
  app.useGlobalFilters(new ValidationFilter());

  await app.listen(3000);
}
bootstrap();
