import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { TJwtPayload } from '@/domain/types/jwt-payload';
import { ChangePasswordUseCase } from '@/domain/use-cases/change-password/change-password.use-case';
import { ChangePasswordReqDto } from '@/domain/use-cases/change-password/dtos/change-password.req.dto';
import { ChangePasswordResDto } from '@/domain/use-cases/change-password/dtos/change-password.res.dto';
import { LoginReqDto } from '@/domain/use-cases/login/dtos/login.req.dto';
import { LoginResDto } from '@/domain/use-cases/login/dtos/login.res.dto';
import { LoginUseCase } from '@/domain/use-cases/login/login.use-case';
import { RefreshTokenReqDto } from '@/domain/use-cases/refresh-token/dtos/refresh-token.req.dto';
import { RefreshTokenResDto } from '@/domain/use-cases/refresh-token/dtos/refresh-token.res.dto';
import { RefreshTokenUseCase } from '@/domain/use-cases/refresh-token/refresh-token.use-case';
import { SignUpReqDto } from '@/domain/use-cases/sign-up/dtos/sign-up.req.dto';
import { SignUpResDto } from '@/domain/use-cases/sign-up/dtos/sign-up.res.dto';
import { SignUpUseCase } from '@/domain/use-cases/sign-up/sign-up.use-case';
import { JwtPayload } from '@/frameworks/decorators/jwt-payload.decorator';
import { JwtGuard } from '@/frameworks/guards/jwt.guard';
import { BadRequestDto } from '@/gateways/dtos/bad-request.dto';
import { CommonExceptionDto } from '@/gateways/dtos/common-exception.dto';
import { CurrentUserResDto } from '@/gateways/dtos/current-user.res.dto';

@Controller()
export class AuthController {
    constructor(
        private readonly signUpUseCase: SignUpUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly changePasswordUseCase: ChangePasswordUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
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
        console.log('Hello');
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

    @Get('whoiam')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get current user information',
        description: 'From access token, get user information',
    })
    @ApiOkResponse({
        description: 'Current user information',
        type: CurrentUserResDto,
    })
    @ApiUnauthorizedResponse({
        description: 'You are unauthorized',
        type: CommonExceptionDto,
    })
    whoIAm(@JwtPayload() jwtPayload: TJwtPayload) {
        return new CurrentUserResDto(jwtPayload.id, jwtPayload.email);
    }

    @Put('change-password')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Change user password',
        description:
            'Change user password. Your previous token will be expired.',
    })
    @ApiOkResponse({
        description: 'New credentials are returned',
        type: ChangePasswordResDto,
    })
    @ApiUnauthorizedResponse({
        description: 'You are unauthorized',
        type: CommonExceptionDto,
    })
    changePassword(
        @Body() dto: ChangePasswordReqDto,
        @JwtPayload() jwtPayload: TJwtPayload,
    ) {
        return this.changePasswordUseCase.execute(jwtPayload.id, dto);
    }

    @Put('refresh-token')
    @ApiOperation({
        summary: 'Get new token with refresh token.',
        description: 'Get new token with refresh token.',
    })
    @ApiOkResponse({
        description: 'Your new tokens',
        type: RefreshTokenResDto,
    })
    @ApiBadRequestResponse({
        description: 'Failed request validation',
        type: BadRequestDto,
    })
    refreshToken(@Body() dto: RefreshTokenReqDto) {
        return this.refreshTokenUseCase.execute(dto);
    }
}
