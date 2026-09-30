import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.GRPC_PORT || 5001;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'productos',
      protoPath: join(__dirname, 'productos.proto'), // ✅ Usar __dirname nativo
      url: `0.0.0.0:${port}`,
    },
  });

  await app.listen();
  console.log(`Microservicio gRPC activo en 0.0.0.0:${port}`);
}
bootstrap();