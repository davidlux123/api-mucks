import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigureMockController } from './configure-mock.controller';
import { ConfigureMockService } from './configure-mock.service';
import { MockMiddleware } from './mock.middleware';

@Module({
  controllers: [ConfigureMockController],
  providers: [ConfigureMockService],
  exports: [ConfigureMockService], // hacerlo publico para llamarlo en el middleware
})
export class ConfigureMockModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MockMiddleware)
      .exclude(
        'configure-mock',
        'configure-mock/ping', // Ruta de health check
        'api/docs', // Ruta de Swagger
        'api/docs-json', // Ruta de Swagger JSON
      )
      .forRoutes('*'); // Aplica a todas las demás rutas
  }
}
