import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { json } from 'body-parser';
import { Request, Response } from 'express';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AuthProxyMiddleware implements NestMiddleware {
    private readonly proxy: RequestHandler;

    private readonly jsonParseMiddleware = json();

    constructor(
        private readonly configService: ConfigService,
        logger: Logger,
    ) {
        this.proxy = createProxyMiddleware<Request, Response>({
            target: configService.getOrThrow<string>('AUTH_URL'),
            pathRewrite: {
                '/auth': '',
            },
            secure: false,
            on: {
                proxyReq: (_, req) => {
                    logger.log(
                        `[NestMiddleware]: Proxying ${req.method} request originally made to '${req.originalUrl}'...`,
                    );
                },
            },
            changeOrigin: true,
        });
    }

    use(req: Request, res: Response, next: () => void) {
        if (req.path.startsWith(this.configService.getOrThrow('AUTH_PREFIX'))) {
            return this.proxy(req, res, next);
        } else {
            return this.jsonParseMiddleware(req, res, next);
        }
    }
}
