import { ApiProperty } from '@nestjs/swagger';

export class BadRequestDto {
    @ApiProperty({ type: [String], example: ['email must be an email'] })
    message: string[];

    @ApiProperty({ example: 'Bad Request' })
    error: string;

    @ApiProperty({ example: 400 })
    statusCode: number;
}
