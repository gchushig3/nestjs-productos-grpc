import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as grpc from '@grpc/grpc-js';
import { ProductosHttpController } from './productos-http.controller.js';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCTOS_GRPC',
        transport: Transport.GRPC,
        options: {
          package: 'productos',
          protoPath: join(__dirname, 'productos.proto'),
          url: process.env.GRPC_URL || 'reseau.proxy.rlwy.net:34929',
          credentials: grpc.credentials.createInsecure(),
        },
      },
    ]),
  ],
  controllers: [ProductosHttpController],
})
export class AppModule {}