import { SignUpDTO } from "../../dto/sign-up";
import { MessageProducer } from "../../services/messaging/message-producer";
import { SignUpUseCase } from "./sign-up-use-case";

const mockedDate = new Date('2022-10-10');
jest.spyOn<any, any>(global, 'Date').mockImplementation(() => {
    return mockedDate;
});

const email = "test@email.dev";
const name = "test name";
const password = "the_user_password";
const password_confirmation = "the_user_password";
const registrationDate = new Date();

describe("SignUpUseCase", () => {
    it(`should encrypt the provided password before forwarding it to the repository along with the other fields`, async () => {
        const signUpDto: SignUpDTO = { email, name, password, password_confirmation, registrationDate };
        const producer: MessageProducer = { publish: jest.fn() };
        const repo = { findById: jest.fn(), storeUser: jest.fn().mockResolvedValue({password, password_confirmation}) };
        const encrypter = { encrypt: jest.fn().mockReturnValue('hashed_password') };
        const sut = new SignUpUseCase(repo, encrypter, producer);
        
        const storeUserSpy = jest.spyOn(repo, 'storeUser');
        
        await sut.execute(signUpDto);

        expect(storeUserSpy).toHaveBeenCalledWith({ ...signUpDto, password: 'hashed_password', registrationDate: new Date() });
    });

    it(`should publish a message in the events topic alerting a user has created an account`, async () => {
        const signUpDto: SignUpDTO = { email, name, password, password_confirmation, registrationDate };
        const producer: MessageProducer = { publish: jest.fn() };
        const repo = { findById: jest.fn(), storeUser: jest.fn().mockResolvedValue({password, password_confirmation}) };
        const encrypter = { encrypt: jest.fn().mockReturnValue('hashed_password') };
        const sut = new SignUpUseCase(repo, encrypter, producer);

        const publishSpy = jest.spyOn(producer, 'publish');
        
        await sut.execute(signUpDto);

        expect(publishSpy).toHaveBeenCalled();
    });
});
