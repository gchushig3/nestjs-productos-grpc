import { Test, TestingModule } from '@nestjs/testing';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { firstValueFrom, toArray } from 'rxjs';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should return a product by id', () => {
    expect(appController.obtenerProducto({ id: 2 })).toEqual({
      id: 2,
      nombre: 'Mouse inalámbrico',
      precio: 19.5,
    });
  });

  it('should throw NOT_FOUND when the product does not exist', () => {
    try {
      appController.obtenerProducto({ id: 99 });
      throw new Error('Expected RpcException');
    } catch (error) {
      expect(error).toBeInstanceOf(RpcException);
      expect((error as RpcException).getError()).toMatchObject({
        code: status.NOT_FOUND,
        message: 'Producto 99 no existe',
      });
    }
  });

  it('should stream all products', async () => {
    const products = await firstValueFrom(appController.listarProductos().pipe(toArray()));

    expect(products).toHaveLength(3);
    expect(products[0]).toMatchObject({ id: 1, nombre: 'Teclado mecánico', precio: 45.9 });
    expect(products[2]).toMatchObject({ id: 3, nombre: 'Monitor 24 XL"', precio: 129.99 });
  });
});
