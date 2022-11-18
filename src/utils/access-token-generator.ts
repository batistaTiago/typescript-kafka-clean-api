import { container } from "tsyringe";
import { UserModel } from "../domain/dto/user/user-model";
import { Encrypter } from "../domain/services/cryptography/encrypter";

export function generateAccessToken(user: Pick<UserModel, 'id'>, encrypter?: Encrypter): string {
    return (encrypter ?? (container.resolve('Encrypter') as Encrypter)).encrypt({ id: user.id });
}