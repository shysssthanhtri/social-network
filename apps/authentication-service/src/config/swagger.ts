import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const configSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Authentication service')
    .setDescription('Authentication service APIs')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, documentFactory);
};
