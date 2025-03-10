import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SignUpEvent, SignUpQueue } from 'rabbitmq-config';

import { AddUserUseCase } from '@/domain/use-cases/add-user/add-user.use-case';

@Controller()
export class UsersListener {
    constructor(private readonly addUserUseCase: AddUserUseCase) {}

    @EventPattern(SignUpQueue.patterns.SIGN_UP)
    addUser(@Payload() data: SignUpEvent) {
        return this.addUserUseCase.execute(data);
    }
}
