import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config, ConfigType } from './configuration/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<ConfigType>);
  const globalPrefix =
    configService.getOrThrow<string>('globalPrefix') || 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      always: true,
      disableErrorMessages: false,
    }),
  );
  app.enableVersioning();
  const cors = app.get(ConfigService).get<string>('cors');
  app.enableCors({ origin: cors });
  const config = new DocumentBuilder()
    .setTitle('Kamban Board APIs')
    .setDescription('Use Kamban Board APIs Document')
    .setVersion('1.0')
    .addBearerAuth({ name: 'JWT', type: 'http' }, 'JWT')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  const port = configService.getOrThrow<number>('port') || 3000;
  Logger.log(`Application running on port ${port}`);

  await app.listen(port);
}
bootstrap();
