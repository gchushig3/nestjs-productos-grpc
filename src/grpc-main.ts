import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GrpcModule } from './grpc.module.js';

async function bootstrap() {
  const port = process.env.GRPC_PORT || 5001;
  const protoPath = join(dirname(fileURLToPath(import.meta.url)), 'productos.proto');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(GrpcModule, {
    transport: Transport.GRPC,
    options: {
      package: 'productos',
      protoPath: protoPath,
      url: `0.0.0.0:${port}`,
    },
  });

  await app.listen();
  console.log(`Microservicio gRPC activo en 0.0.0.0:${port}`);
}
bootstrap();