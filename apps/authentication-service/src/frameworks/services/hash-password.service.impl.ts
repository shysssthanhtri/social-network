import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { HashPasswordService } from '@/domain/services/hash-password.service';

@Injectable()
export class HashPasswordServiceImpl extends HashPasswordService {
    async hash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }

    compare(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}
