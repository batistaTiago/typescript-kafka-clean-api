import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm"
import { User } from "../../../../domain/entities/user";
import { VerificationCodeModel } from "../../../models/verification-code-model";
import { User as TypeORMUserModel } from "./user.entity";

@Entity({ name: 'VerificationCodes' })
export class VerificationCode implements VerificationCodeModel {
    @PrimaryGeneratedColumn('uuid')
    id: string
    
    @Column()
    code: string;

    @Column()
    expiresAt?: Date;

    @OneToOne(type => TypeORMUserModel) @JoinColumn() 
    user: User;
}