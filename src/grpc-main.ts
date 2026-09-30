import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GrpcModule } from './grpc.module.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function bootstrap() {
  const grpcPort = Number(process.env.GRPC_PORT || 5001);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(GrpcModule, {
    transport: Transport.GRPC,
    options: {
      package: 'productos',
      protoPath: join(__dirname, 'productos.proto'),
      url: `0.0.0.0:${grpcPort}`,
    },
  });

  await app.listen();
  console.log(`Microservicio gRPC escuchando en 0.0.0.0:${grpcPort}`);
}

void bootstrap();