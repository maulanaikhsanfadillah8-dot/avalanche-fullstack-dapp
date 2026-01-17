import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Global validation (aktifkan class-validator & class-transformer)
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // ✅ Swagger config
  const config = new DocumentBuilder()
    .setTitle('Simple Storage dApp API')
    .setDescription('API untuk smart contract events')
    .setVersion('1.0')
    .addTag('blockchain')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});
