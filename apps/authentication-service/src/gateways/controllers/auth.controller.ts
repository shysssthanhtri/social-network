import { Body, Controller, Post } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiOperation,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { LoginReqDto } from '@/domain/use-cases/login/dtos/login.req.dto';
import { LoginResDto } from '@/domain/use-cases/login/dtos/login.res.dto';
import { LoginUseCase } from '@/domain/use-cases/login/login.use-case';
import { SignUpReqDto } from '@/domain/use-cases/sign-up/dtos/sign-up.req.dto';
import { SignUpResDto } from '@/domain/use-cases/sign-up/dtos/sign-up.res.dto';
import { SignUpUseCase } from '@/domain/use-cases/sign-up/sign-up.use-case';
import { BadRequestDto } from '@/gateways/dtos/bad-request.dto';
import { CommonExceptionDto } from '@/gateways/dtos/common-exception.dto';

@Controller()
export class AuthController {
    constructor(
        private readonly signUpUseCase: SignUpUseCase,
        private readonly loginUseCase: LoginUseCase,
    ) {}

    @Post('signup')
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
        type: CommonExceptionDto,
    })
    signUp(@Body() dto: SignUpReqDto) {
        return this.signUpUseCase.execute(dto);
    }

    @Post('login')
    @ApiOperation({
        summary: 'Login with email and password',
        description:
            'Login with email and password, return authentication credentials',
    })
    @ApiCreatedResponse({
        description: 'Credentials are returned',
        type: LoginResDto,
    })
    @ApiBadRequestResponse({
        description: 'Failed request validation',
        type: BadRequestDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Your credentials are incorrect',
        type: CommonExceptionDto,
    })
    login(@Body() dto: LoginReqDto) {
        return this.loginUseCase.execute(dto);
    }
}
