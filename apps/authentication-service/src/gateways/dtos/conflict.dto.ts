import { ApiProperty } from '@nestjs/swagger';

export class ConflictDto {
    @ApiProperty({ example: 'Data is existed' })
    message: string;

    @ApiProperty({ example: 'Conflict' })
    error: string;

    @ApiProperty({ example: 409 })
    statusCode: number;
}
