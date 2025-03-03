import { INestApplication, ValidationPipe } from '@nestjs/common';

export const setupPipelines = (app: INestApplication) => {
    app.useGlobalPipes(new ValidationPipe());
};
