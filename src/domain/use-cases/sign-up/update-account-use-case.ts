import { inject, injectable } from "tsyringe";
import { UpdateAccountDTO, UserUpdateableFields } from "../../dto/user/update-account";
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
        // @@TODO: quem deveria validar isso? no usecase de sign up esta sendo validado no controller...
        const fieldsToUpdate: UserUpdateableFields = { name: fields.name };
        const newPassword = await this.getPasswordUpdatedValue(account, fields);

        if (newPassword) {
            fieldsToUpdate.password = newPassword;
        }

        // @@TODO: testar se esse cara ta sendo enviado para o update...
        const { password, ...updatedAccount } = await this.accountRepository.updateAccount(account, fieldsToUpdate);

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

    private async getPasswordUpdatedValue(account: UserAccount, fields: UpdateAccountDTO): Promise<string> {
        if (!fields.password) {
            return null;
        }

        if (!fields.current_password) {
            throw new AppError('You must confirm your current password');
        }

        if (!await this.hash.check(fields.current_password, account.password)) {
            throw new AppError('The provided current password is incorrect');
        }

        if (fields.password != fields.password_confirmation) {
            throw new AppError('Password and confirmation do not match');
        }

        return await this.hash.make(fields.password);
    }
}
