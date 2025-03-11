import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    email: string;

    @Column()
    hashedPassword: string;

    @Column({
        default: 1,
        comment:
            'Version of current password. Each time change password need to be increased.',
    })
    passwordVersion: number;
}
