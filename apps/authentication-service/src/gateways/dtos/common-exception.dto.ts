import { ApiProperty } from '@nestjs/swagger';

export class CommonExceptionDto {
    @ApiProperty({ example: 'Data is existed' })
    message: string;

    @ApiProperty({ example: 'Conflict', required: false })
    error?: string;

    @ApiProperty({ example: 409 })
    statusCode: number;
}
