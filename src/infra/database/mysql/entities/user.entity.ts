import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { UserModel } from "../../../models/user-model";

@Entity()
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