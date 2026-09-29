import { BadRequestException, Controller, Get, NotFoundException, Param, ParseIntPipe, Query, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { lastValueFrom, Observable, toArray } from 'rxjs';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

interface ProductoServiceClient {
  obtenerProducto(request: { id: number }): Observable<Producto>;
  listarProductos(request: Record<string, never>): Observable<Producto>;
  buscarPorPrecioMaximo(request: { precioMaximo: number }): Observable<Producto>;
}

@Controller('api/productos')
export class ProductosHttpController implements OnModuleInit {
  private productosService!: ProductoServiceClient;

  constructor(@Inject('PRODUCTOS_GRPC') private readonly grpcClient: ClientGrpc) {}

  onModuleInit(): void {
    this.productosService = this.grpcClient.getService<ProductoServiceClient>('ProductoService');
  }

  @Get()
  async listar(@Query('precioMaximo') precioMaximo?: string): Promise<Producto[]> {
    if (precioMaximo === undefined || precioMaximo === '') {
      return lastValueFrom(this.productosService.listarProductos({}).pipe(toArray()));
    }

    const limite = Number(precioMaximo);
    if (!Number.isFinite(limite) || limite < 0) {
      throw new BadRequestException('El precio máximo debe ser un número válido.');
    }
    return lastValueFrom(this.productosService.buscarPorPrecioMaximo({ precioMaximo: limite }).pipe(toArray()));
  }

  @Get(':id')
  async obtener(@Param('id', ParseIntPipe) id: number): Promise<Producto> {
    try {
      return await lastValueFrom(this.productosService.obtenerProducto({ id }));
    } catch {
      throw new NotFoundException(`Producto ${id} no existe en el microservicio gRPC.`);
    }
  }
}
