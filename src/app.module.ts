import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { ConfigureMockModule } from './configure-mock/configure-mock.module';

@Module({
  imports: [ConfigureMockModule],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
