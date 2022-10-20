import { inject, injectable } from "tsyringe";
import { UserModel } from "../../../infra/models/user-model";
import { SignUpDTO } from "../../dto/sign-up";
import { Encrypter } from "../../services/cryptography/encrypter";
import { MessageProducer } from "../../services/messaging/message-producer";
import { UserRepository } from "../../services/repositories/user-repository";
import { UseCase } from "../use-case";

@injectable()
export class SignUpUseCase implements UseCase {
    public constructor(
        @inject("UserRepository") private readonly userRepository: UserRepository,
        @inject("Encrypter") private readonly encrypter: Encrypter,
        @inject("MessageProducer") private readonly messageProducer: MessageProducer
    ) { }

    public async execute(data: SignUpDTO): Promise<UserModel> {
        const encryptedPassword = await this.encrypter.encrypt(data.password);
        const insertResult = await this.userRepository.storeUser({ ...data, password: encryptedPassword });
        const { password, password_confirmation, ...user} = insertResult;
        await this.publishUserAccountCreatedEvent(user);
        return user;
    }

    private async publishUserAccountCreatedEvent(user: UserModel): Promise<void> {
        await this.messageProducer.publish('events', {
            body: {
                eventName: 'USER_ACCOUNT_CREATED',
                happenedAt: new Date(),
                data: user
            }
        });
    }
}