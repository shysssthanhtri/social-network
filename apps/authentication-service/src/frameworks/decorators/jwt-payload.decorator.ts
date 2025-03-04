import {
    createParamDecorator,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';

import { TJwtPayload } from '@/domain/types/jwt-payload';

// Custom decorator to extract 'user' from request
export const JwtPayload = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<{ user?: TJwtPayload }>();
        if (!request.user) {
            throw new UnauthorizedException();
        }
        return request.user; // Extract the 'user' from the request
    },
);
