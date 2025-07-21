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
    action: string,
  ): ConfigureMockDto | undefined {
    return this.mockConfigs.find((config) => {
      // Verificar método y path
      let methodnpath = true;
      // eslint-disable-next-line prettier/prettier
      const whitoutHP = Object.keys(headers).length === 0 && Object.keys(queryParams).length === 0;

      if (whitoutHP || action !== 'insertar') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (config.method !== method || config.path !== path) {
          methodnpath = false;
        }
      }

      // Verificar headers
      const currentHeaders = config.headers ?? {};
      // eslint-disable-next-line prettier/prettier
      const headersMatch = this.validateCurrrent_IncommingMocks('headers', headers, currentHeaders);

      // Verificar query params
      const currentParams = config.queryParams ?? {};
      // eslint-disable-next-line prettier/prettier
      const ParamsMatch = this.validateCurrrent_IncommingMocks('queryParams', queryParams, currentParams);

      // // Verificar body
      // if (config.body) {
      //   const configBody = JSON.stringify(config.body);
      //   const requestBody = JSON.stringify(body);
      //   if (configBody !== requestBody) return false;
      // }

      return methodnpath && headersMatch && ParamsMatch;
    });
  }

  private validateCurrrent_IncommingMocks(
    action: string,
    incoming: Record<string, any>,
    current: Record<string, string>,
  ): boolean {
    const currentLength = Object.keys(current).length;
    const incomingLength = Object.keys(incoming).length;

    if (currentLength > 0 && incomingLength > 0) {
      for (const [key, value] of Object.entries(current)) {
        if (
          incoming[key.toLocaleLowerCase()] !== value &&
          incoming[key] !== value
        )
          return false;
      }
    } else if (currentLength !== incomingLength && action !== 'headesrs') {
      return false;
    }

    return true;
  }
}
