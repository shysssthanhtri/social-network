import { Body, Controller, Post } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiOperation,
} from '@nestjs/swagger';

import { SignUpReqDto } from '@/domain/use-cases/sign-up/dtos/sign-up.req.dto';
import { SignUpResDto } from '@/domain/use-cases/sign-up/dtos/sign-up.res.dto';
import { SignUpUseCase } from '@/domain/use-cases/sign-up/sign-up.use-case';
import { BadRequestDto } from '@/gateways/dtos/bad-request.dto';
import { ConflictDto } from '@/gateways/dtos/conflict.dto';

@Controller()
export class AuthController {
    constructor(private readonly signUpUseCase: SignUpUseCase) {}

    @Post()
    @ApiOperation({
        summary: 'Sign up new account',
        description:
            'Sign up new account, and return authentication credentials',
    })
    @ApiCreatedResponse({
        description: 'New user is created, and credentials are returned',
        type: SignUpResDto,
    })
    @ApiBadRequestResponse({
        description: 'Failed request validation',
        type: BadRequestDto,
    })
    @ApiConflictResponse({
        description: 'Email is existed',
        type: ConflictDto,
    })
    signUp(@Body() dto: SignUpReqDto) {
        return this.signUpUseCase.execute(dto);
    }
}
