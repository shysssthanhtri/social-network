import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const configSwagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('Authentication service')
        .setDescription('Authentication service APIs')
        .setVersion('1.0')
        .addServer(
            'http://localhost:3000',
            'For authentication service internally.',
        )
        .addServer('http://localhost:4000/auth', 'For api gateway.')
        .addBearerAuth()
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('doc', app, documentFactory);
};
