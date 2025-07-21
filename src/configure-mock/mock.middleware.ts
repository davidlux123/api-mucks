import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigureMockService } from './configure-mock.service';
import AppError from 'src/common/errors/app-error';

@Injectable()
export class MockMiddleware implements NestMiddleware {
  constructor(private readonly mockService: ConfigureMockService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { method, query, headers, body } = req;
    const path = req.baseUrl;
    // Excluir rutas de configuración y ping
    if (
      path.startsWith('/configure-mock') ||
      path.startsWith('/api/docs') ||
      path === '/ping'
    ) {
      return next();
    }

    const matchingConfig = this.mockService.findMatchingConfig(
      path,
      method,
      query,
      headers,
      body,
      'buscar',
    );

    if (!matchingConfig) {
      throw new AppError('Mock configuration not found', 404);
    }

    // Aplicar configuración
    if (matchingConfig.headers) {
      Object.entries(matchingConfig.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
    }

    res.status(matchingConfig.statusCode).json(matchingConfig.response);
  }
}
