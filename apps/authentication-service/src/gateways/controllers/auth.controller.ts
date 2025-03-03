import { Body, Controller, Post } from '@nestjs/common';

import { SignUpReqDto } from '@/domain/use-cases/sign-up/dtos/sign-up.req.dto';
import { SignUpUseCase } from '@/domain/use-cases/sign-up/sign-up.use-case';

@Controller()
export class AuthController {
    constructor(private readonly signUpUseCase: SignUpUseCase) {}

    @Post()
    signUp(@Body() dto: SignUpReqDto) {
        return this.signUpUseCase.execute(dto);
    }
}
