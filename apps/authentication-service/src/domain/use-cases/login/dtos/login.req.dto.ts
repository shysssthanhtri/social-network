import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginReqDto {
    @ApiProperty({ example: 'abc@abc.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'abc' })
    @IsString()
    @MinLength(3)
    password: string;
}
