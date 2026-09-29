import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import express from 'express';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AppModule } from './app.module.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function bootstrap() {
  const port = Number(process.env.PORT ?? 5000);
  const grpcPort = Number(process.env.GRPC_PORT ?? 5001);

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(express.static(join(__dirname, '..', 'public')));
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'productos',
      protoPath: join(__dirname, 'productos.proto'),
      url: `0.0.0.0:${grpcPort}`,
    },
  });

  await app.startAllMicroservices();
  await app.listen(port, '0.0.0.0');
  console.log(`Frontend y API HTTP escuchando en 0.0.0.0:${port}`);
  console.log(`Microservicio gRPC escuchando en 0.0.0.0:${grpcPort}`);
}

bootstrap();
