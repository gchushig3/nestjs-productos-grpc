import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller.js';

describe('AppController (e2e)', () => {
  let controller: AppController;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = moduleFixture.get<AppController>(AppController);
  });

  it('should return the product for the given id', () => {
    expect(controller.obtenerProducto({ id: 1 })).toMatchObject({
      id: 1,
      nombre: 'Teclado mecánico',
      precio: 45.9,
    });
  });

  it('should list all products', async () => {
    const products = await controller.listarProductos().toPromise();
    expect(products).toHaveLength(3);
  });
});
