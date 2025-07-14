import { Injectable } from '@nestjs/common';
import { ConfigureMockDto } from './dto/configure-mock.dto';
import AppError from 'src/common/errors/app-error';

@Injectable()
export class ConfigureMockService {
  private mockConfigs: ConfigureMockDto[] = [];

  configureMock(config: ConfigureMockDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { path, method, queryParams, headers, body } = config;
    const matchingConfig = this.findMatchingConfig(
      path,
      method,
      queryParams ?? {},
      headers ?? {},
      body,
      'insertar',
    );

    if (matchingConfig) {
      throw new AppError('Dupicate Mock', 409);
    }

    this.mockConfigs.push(config);
    return config;
  }

  getAllConfigs() {
    return this.mockConfigs;
  }

  // configure-mock.service.ts
  findMatchingConfig(
    path: string,
    method: string,
    queryParams: Record<string, any>,
    headers: Record<string, any>,
    body: any,
    action?: string,
  ): ConfigureMockDto | undefined {
    return this.mockConfigs.find((config) => {
      // Verificar método y path
      let methodnpath = true;
      const whitoutHP =
        Object.keys(headers).length === 0 &&
        Object.keys(queryParams).length === 0;

      if (whitoutHP || !action || (action && action !== 'insertar')) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (config.method !== method || config.path !== path) {
          methodnpath = false;
        }
      }

      // Verificar headers
      let headersMatch = true;
      if (config.headers) {
        for (const [key, value] of Object.entries(config.headers)) {
          if (
            headers[key.toLocaleLowerCase()] !== value &&
            headers[key] !== value
          )
            headersMatch = false;
        }
      } else if (
        Object.keys(headers).length > 0 &&
        action &&
        action === 'insertar'
      ) {
        headersMatch = false;
      }

      // Verificar query params
      let queryParamsMatch = true;
      if (config.queryParams) {
        for (const [key, value] of Object.entries(config.queryParams)) {
          if (queryParams[key] !== value) queryParamsMatch = false;
        }
      } else if (Object.keys(queryParams).length > 0) {
        queryParamsMatch = false;
      }
      // // Verificar body
      // if (config.body) {
      //   const configBody = JSON.stringify(config.body);
      //   const requestBody = JSON.stringify(body);
      //   if (configBody !== requestBody) return false;
      // }

      return methodnpath && headersMatch && queryParamsMatch;
    });
  }
}
