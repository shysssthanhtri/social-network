import { ApiProperty } from '@nestjs/swagger';

export class SignUpResDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}
