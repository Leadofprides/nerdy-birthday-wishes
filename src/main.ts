import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get(ConfigService);
  const port = config.get('node_port');
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nerdy Birthday Wishes')
    .setDescription('Nerdy Birthday Wishes RESTful API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
  await app.listen(port);
  app.enableCors();
  Logger.log(`Listening at ${port} port`);
}
bootstrap();
