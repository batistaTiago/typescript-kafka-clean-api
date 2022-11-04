import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { UserModel } from "../../../../domain/dto/user/user-model";

@Entity({ name: 'users' })
export class User implements UserModel {
    @PrimaryGeneratedColumn('uuid')
    id: string
    
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    registrationDate: Date;
}