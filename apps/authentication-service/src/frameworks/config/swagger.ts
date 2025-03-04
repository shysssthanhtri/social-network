import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const configSwagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('Authentication service')
        .setDescription('Authentication service APIs')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('doc', app, documentFactory);
};
