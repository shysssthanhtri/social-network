import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenResDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;

    constructor(accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
