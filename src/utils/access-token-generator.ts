import { container } from "tsyringe";
import { Encrypter } from "../domain/services/cryptography/encrypter";
import { User } from "../infra/database/mysql/entities/user.entity";

export function generateAccessToken(user: Pick<User, 'id'>, encrypter?: Encrypter): string {
    return (encrypter ?? (container.resolve('Encrypter') as Encrypter)).encrypt({ id: user.id, issuedAt: new Date() });
}