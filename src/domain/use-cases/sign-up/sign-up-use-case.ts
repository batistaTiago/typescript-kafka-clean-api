import { inject, injectable } from "tsyringe";
import { UserModel } from "../../dto/user/user-model";
import { SignUpDTO } from "../../dto/user/sign-up";
import { Events } from "../../enums/events";
import { Hash, HashMake } from "../../services/cryptography/hash";
import { MessageProducer } from "../../services/messaging/message-producer";
import { StoreUserRepository } from "../../services/repositories/user-repository";
import { UseCase } from "../use-case";

@injectable()
export class SignUpUseCase implements UseCase {
    public constructor(
        @inject("UserRepository") private readonly userRepository: StoreUserRepository,
        @inject("HashMake") private readonly hash: HashMake,
        @inject("MessageProducer") private readonly messageProducer: MessageProducer
    ) { }

    public async execute(data: SignUpDTO): Promise<UserModel> {
        const encryptedPassword = await this.hash.make(data.password);
        const insertResult = await this.userRepository.storeUser({ ...data, password: encryptedPassword });
        const { password, password_confirmation, ...user } = insertResult;
        await this.publishUserAccountCreatedEvent(user);
        return user;
    }

    private async publishUserAccountCreatedEvent(user: UserModel): Promise<void> {
        await this.messageProducer.publish('events', {
            body: {
                eventName: Events.USER_ACCOUNT_CREATED,
                happenedAt: new Date(),
                data: user
            }
        });
    }
}