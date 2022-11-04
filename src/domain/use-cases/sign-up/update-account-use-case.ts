import { inject, injectable } from "tsyringe";
import { UpdateAccountDTO } from "../../dto/user/update-account";
import { UserAccount } from "../../dto/user/user-account";
import { Event } from "../../entities/event";
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
        @inject("MessageProducer") private readonly messageProducer: MessageProducer
    ) { }

    public async execute({ account, fields }: { account: UserAccount, fields: UpdateAccountDTO }): Promise<object> {
        if (fields.password) {
            await this.validatePasswordChange(account, fields);
        }

        const { password, ...updatedAccount } = await this.accountRepository.updateAccount(account, {
            name: fields.name,
            password: await this.hash.make(fields.password)
        });

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

    private async validatePasswordChange(account: UserAccount, fields: UpdateAccountDTO) {
        if (!await this.hash.check(fields.current_password, account.password)) {
            throw new AppError('You must confirm your current password');
        }

        if (fields.password != fields.password_confirmation) {
            throw new AppError('Password and confirmation do not match!');
        }
    }
}
