import { ObjectHelper } from "../../../utils/object-helper"
import { UpdateAccountDTO } from "../../dto/user/update-account"
import { UserAccount } from "../../dto/user/user-account"
import { AppError } from "../../exceptions/app-error"
import { Hash } from "../../services/cryptography/hash"
import { MessageProducer } from "../../services/messaging/message-producer"
import { AccountRepository } from "../../services/repositories/user-repository"
import { UpdateAccountUseCase } from "./update-account-use-case"

const mockedDate = new Date('2022-06-11');
jest.spyOn<any, any>(global, 'Date').mockImplementation(() => mockedDate)

const makeProducer = () => ({ publish: jest.fn() } as unknown as MessageProducer);

const makeRepo = () => ({
    updateAccount: jest.fn().mockResolvedValue({
        password: "new_password",
        name: "new name"
    })
} as unknown as AccountRepository);

const makeHash = () => ({ make: jest.fn().mockReturnValue('hashed'), check: jest.fn().mockReturnValue(true) } as unknown as Hash);

const getAccountData = () => ({
    id: "user-id",
    password: "userpassword",
    name: "username",
    email: "email@test.dev",
    registrationDate: new Date(),
});

const helper = new ObjectHelper();

describe('UpdateAccountCseCase', () => {
    it('should not call hash check and make component if its not updating the password', async () => {
        const repo = makeRepo();
        const hash = makeHash();
        const producer = makeProducer();

        const makeSpy = jest.spyOn(hash, 'make');
        const checkSpy = jest.spyOn(hash, 'check');

        const sut = new UpdateAccountUseCase(repo, hash, producer, helper);

        const account: UserAccount = getAccountData();

        const fields = {
            name: "new name",
        } as unknown as UpdateAccountDTO;

        await sut.execute({ account, fields });

        expect(makeSpy).not.toHaveBeenCalled();
        expect(checkSpy).not.toHaveBeenCalled();
    });

    it('should call hash component if its updating the password', async () => {
        const repo = makeRepo();
        const hash = makeHash();
        const producer = makeProducer();

        const makeSpy = jest.spyOn(hash, 'make');
        const checkSpy = jest.spyOn(hash, 'check');

        const sut = new UpdateAccountUseCase(repo, hash, producer, helper);

        const account: UserAccount = getAccountData();

        const fields = {
            name: "new name",
            current_password: "userpassword",
            password: "new_password",
            password_confirmation: "new_password",
        } as unknown as UpdateAccountDTO;

        await sut.execute({ account, fields });

        expect(checkSpy).toHaveBeenCalledWith(fields.current_password, account.password);
        expect(makeSpy).toHaveBeenCalledWith(fields.password);
    });

    it('should call repo to update the user name', async () => {
        const repo = makeRepo();
        const hash = makeHash();
        const producer = makeProducer();

        const repoSpy = jest.spyOn(repo, 'updateAccount');

        const sut = new UpdateAccountUseCase(repo, hash, producer, helper);

        const account: UserAccount = getAccountData();

        const fields = {
            name: "new name",
        } as unknown as UpdateAccountDTO;

        await sut.execute({ account, fields });

        expect(repoSpy).toHaveBeenCalledWith(account, { name: fields.name });
    });

    it('should call repo to update the user name and password', async () => {
        const repo = makeRepo();
        const hash = makeHash();
        const producer = makeProducer();

        const repoSpy = jest.spyOn(repo, 'updateAccount');

        const sut = new UpdateAccountUseCase(repo, hash, producer, helper);

        const account: UserAccount = getAccountData();

        const fields = {
            name: "new name",
            current_password: "userpassword",
            password: "new_password",
            password_confirmation: "new_password",
        } as unknown as UpdateAccountDTO;

        await sut.execute({ account, fields });

        expect(repoSpy).toHaveBeenCalledWith(account, { name: fields.name, password: 'hashed' });
    });

    it('should not update an empty name', async () => {
        const repo = makeRepo();
        const hash = makeHash();
        const producer = makeProducer();

        const repoSpy = jest.spyOn(repo, 'updateAccount');

        const sut = new UpdateAccountUseCase(repo, hash, producer, helper);

        const account: UserAccount = getAccountData();

        const fields = {
            current_password: "userpassword",
            password: "new_password",
            password_confirmation: "new_password",
        } as unknown as UpdateAccountDTO;

        await sut.execute({ account, fields });

        expect(repoSpy).toHaveBeenCalledWith(account, { password: 'hashed' });
    });

    it('should call producer to send a new event about the account updated event', async () => {
        const repo = makeRepo();
        const hash = makeHash();
        const producer = makeProducer();

        const producerSpy = jest.spyOn(producer, 'publish');

        const sut = new UpdateAccountUseCase(repo, hash, producer, helper);

        const account: UserAccount = getAccountData();

        const fields = {
            name: "new name",
        } as unknown as UpdateAccountDTO;

        await sut.execute({ account, fields });

        const message = {
            body: {
                data: { name: "new name" },
                eventName: "USER_ACCOUNT_UPDATED",
                happenedAt: mockedDate
            }
        };

        expect(producerSpy).toHaveBeenCalledWith('events', message);
    });

    it('should throw an error if attempting to update the password providing a wrong current password', () => {
        const repo = makeRepo();
        const hash = makeHash();
        const producer = makeProducer();

        hash.check = jest.fn().mockResolvedValueOnce(false);

        const sut = new UpdateAccountUseCase(repo, hash, producer, helper);

        const account: UserAccount = getAccountData();

        const fields = {
            name: "new name",
            current_password: "wrong",
            password: "new_password",
            password_confirmation: "new_password",
        } as unknown as UpdateAccountDTO;

        const executionPromise = sut.execute({ account, fields });

        expect(executionPromise).rejects.toThrow(new AppError('The provided current password is incorrect'));
    });
});
