import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

export class ConfigureMockDto {
  @IsString()
  @IsNotEmpty()
  path: string; // Ej: '/api/v1/productos'

  @IsEnum(HttpMethod)
  method: HttpMethod;

  @IsObject()
  @IsOptional()
  queryParams?: Record<string, string>;

  @IsObject()
  @IsOptional()
  headers?: Record<string, string>;

  @IsObject()
  @IsOptional()
  body?: any;

  @IsNumber()
  @IsNotEmpty()
  statusCode: number;

  @IsObject()
  @IsNotEmpty()
  response: any; // Respuesta mockeada
}
