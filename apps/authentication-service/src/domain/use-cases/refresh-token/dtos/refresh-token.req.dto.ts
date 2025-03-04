import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenReqDto {
    @ApiProperty()
    refreshToken: string;
}
