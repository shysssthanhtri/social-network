import { ApiProperty } from '@nestjs/swagger';

export class CurrentUserResDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    constructor(id: string, email: string) {
        this.id = id;
        this.email = email;
    }
}
