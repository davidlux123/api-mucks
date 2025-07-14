import {
  //All,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigureMockService } from './configure-mock.service';
import { ConfigureMockDto } from './dto/configure-mock.dto';
import { Response } from 'express';
import AppError from 'src/common/errors/app-error';

@Controller('configure-mock')
export class ConfigureMockController {
  constructor(private readonly mockEndpointsService: ConfigureMockService) {}

  @Get('ping')
  getHello(@Req() req: Request, @Res() res: Response) {
    res.status(200).json({ msg: 'Controller configure-mock Healthy' });
  }

  @Post()
  configureMock(@Res() res: Response, @Body() config: ConfigureMockDto) {
    // Validar que el status code sea válido
    if (config.statusCode < 100 || config.statusCode >= 600) {
      throw new AppError('Invalid HTTP status code', 400);
    }

    if (!config.path.startsWith('/')) {
      throw new AppError('Path must start with /', 400);
    }

    const new_mock = this.mockEndpointsService.configureMock(config);
    res.status(HttpStatus.CREATED).send(new_mock);
  }

  @Get()
  getAllConfigs(@Res() res: Response) {
    res.status(HttpStatus.OK).json(this.mockEndpointsService.getAllConfigs());
  }
}
