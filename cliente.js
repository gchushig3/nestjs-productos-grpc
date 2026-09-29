import path from 'node:path';
import { fileURLToPath } from 'node:url';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, 'src', 'productos.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDef).productos;
const client = new proto.ProductoService('sakura.proxy.rlwy.net:58842', grpc.credentials.createInsecure());

console.log('== ObtenerProducto (unary) ==');
client.obtenerProducto({ id: 1 }, (err, producto) => {
  if (err) {
    console.error('Error gRPC:', err.code, err.details);
    return;
  }

  console.log(`${producto.id} - ${producto.nombre} - $${producto.precio}`);

  console.log('\n== BuscarPorPrecioMaximo (server streaming) ==');
  const callPrecio = client.buscarPorPrecioMaximo({ precioMaximo: 50 });

  callPrecio.on('data', (p) => {
    console.log(`${p.id} - ${p.nombre} - $${p.precio} (filtrado por precio)`);
  });

  callPrecio.on('end', () => {
    console.log('Streaming por precio finalizado.');

    console.log('\n== Prueba de error (id inexistente) ==');
    client.obtenerProducto({ id: 999 }, (err2, producto2) => {
      if (err2) {
        console.log(`Error gRPC: ${err2.code} - ${err2.details}`);
      } else {
        console.log('No debería llegar aquí:', producto2);
      }
    });
  });

  callPrecio.on('error', (err) => {
    console.error('Error en el stream por precio:', err.code, err.details);
  });
});