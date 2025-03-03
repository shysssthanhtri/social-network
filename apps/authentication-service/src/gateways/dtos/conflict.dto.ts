import { ApiProperty } from '@nestjs/swagger';

export class ConflictDto {
    @ApiProperty()
    message: string;

    @ApiProperty()
    statusCode: number;
}
