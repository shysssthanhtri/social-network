import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordReqDto {
    @ApiProperty()
    newPassword: string;
}
