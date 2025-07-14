import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorFilter } from './common/errors/error.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no están en el DTO
      forbidNonWhitelisted: true, // Rechaza peticiones con propiedades no permitidas
      transform: true, // Transforma los datos a los tipos especificados en el DTO
    }),
  ); // Configuración del ValidationPipe global
  app.useGlobalFilters(new ErrorFilter()); // Registra el filtro global

  const options = new DocumentBuilder()
    .setTitle('API Mocks')
    .setDescription('API Mocks for testing purposes')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
