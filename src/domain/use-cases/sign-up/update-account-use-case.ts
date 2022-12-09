import { inject, injectable } from "tsyringe";
import { ObjectHelper } from "../../../utils/object-helper";
import { UpdateAccountDTO, UserUpdateableFields } from "../../dto/user/update-account";
import { UserModel } from "../../dto/user/user-model";
import { Event } from "../../entities/event";
import { User } from "../../entities/user";
import { Events } from "../../enums/events";
import { AppError } from "../../exceptions/app-error";
import { Hash } from "../../services/cryptography/hash";
import { Message } from "../../services/messaging/message";
import { MessageProducer } from "../../services/messaging/message-producer";
import { AccountRepository } from "../../services/repositories/user-repository";
import { UseCase } from "../use-case";

@injectable()
export class UpdateAccountUseCase implements UseCase {
    public constructor(
        @inject('UserRepository') private readonly accountRepository: AccountRepository,
        @inject("Hash") private readonly hash: Hash,
        @inject("MessageProducer") private readonly messageProducer: MessageProducer,
        private readonly objectHelper: ObjectHelper,
    ) { }

    public async execute({ account, fields }: { account: UserModel, fields: UpdateAccountDTO }): Promise<object> {
        // @@TODO: quem deveria validar isso? no usecase de sign up esta sendo validado no controller...
        const fieldsToUpdate: UserUpdateableFields = { name: fields.name };
        const newPassword = await this.getPasswordUpdatedValue(account, fields);

        if (newPassword) {
            fieldsToUpdate.password = newPassword;
        }

        const { password, ...updatedAccount } = await this.accountRepository.updateAccount(
            account, 
            this.objectHelper.removeEmpty(fieldsToUpdate)
        );

        const message: Message<Event> = {
            body: {
                eventName: Events.USER_ACCOUNT_UPDATED,
                happenedAt: new Date(),
                data: updatedAccount
            }
        }

        await this.messageProducer.publish('events', message);

        return { success: true, updatedAccount };
    }

    private async getPasswordUpdatedValue(account: User, fields: UpdateAccountDTO): Promise<string> {
        if (!fields.password) {
            return null;
        }

        if (!await this.hash.check(fields.current_password, account.password)) {
            throw new AppError('The provided current password is incorrect');
        }

        return await this.hash.make(fields.password);
    }
}
