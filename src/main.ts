import { NestFactory } from '@nestjs/core';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AppModule } from './app.module.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const frontendOrigins = process.env.FRONTEND_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean);
  app.enableCors({ origin: frontendOrigins?.length ? frontendOrigins : '*' });

  const port = Number(process.env.PORT || 3000);
  await app.listen(port, '0.0.0.0');
  console.log(`API REST escuchando en 0.0.0.0:${port}`);
}

void bootstrap();