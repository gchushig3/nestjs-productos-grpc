import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ProductosHttpController } from './productos-http.controller.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCTOS_GRPC',
        transport: Transport.GRPC,
        options: {
          package: 'productos',
          protoPath: join(__dirname, 'productos.proto'),
          url: process.env.GRPC_URL ?? '127.0.0.1:5001',
        },
      },
    ]),
  ],
  controllers: [AppController, ProductosHttpController],
  providers: [AppService],
})
export class AppModule {}
