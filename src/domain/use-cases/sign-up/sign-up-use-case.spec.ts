import { SignUpDTO } from "../../dto/user/sign-up";
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

const makeSignUpDto = () => ({ email, name, password, password_confirmation, registrationDate });
const makeProducer = () => ({ publish: jest.fn() });
const makeHasher = () => ({ make: jest.fn().mockReturnValue('hashed_password') });
const makeUserRepo = () => ({ 
    findById: jest.fn(), 
    storeUser: jest.fn().mockResolvedValue({password, password_confirmation}),
    findByEmail: jest.fn()
});

describe("SignUpUseCase", () => {
    it(`should hash the provided password before forwarding it to the repository along with the other fields`, async () => {
        const repo = makeUserRepo();
        const storeUserSpy = jest.spyOn(repo, 'storeUser');

        const sut = new SignUpUseCase(repo, makeHasher(), makeProducer());
        
        const signUpDto = makeSignUpDto();
        await sut.execute(signUpDto);

        expect(storeUserSpy).toHaveBeenCalledWith({ ...signUpDto, password: 'hashed_password', registrationDate: new Date() });
    });

    it(`should publish a message in the events topic alerting a user has created an account`, async () => {
        const producer = makeProducer();
        const publishSpy = jest.spyOn(producer, 'publish');

        const sut = new SignUpUseCase(makeUserRepo(), makeHasher(), producer);
        
        const signUpDto = makeSignUpDto();
        await sut.execute(signUpDto);

        expect(publishSpy).toHaveBeenCalled();
    });
});
