import { SignUpDTO } from "../../dto/sign-up";
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

        const repo = { storeUser: jest.fn().mockResolvedValue({password, password_confirmation}) };
        const encrypter = { encrypt: jest.fn().mockReturnValue('hashed_password') };
        const storeUserSpy = jest.spyOn(repo, 'storeUser');
        const sut = new SignUpUseCase(repo, encrypter);

        await sut.execute(signUpDto);

        expect(storeUserSpy).toHaveBeenCalledWith({ ...signUpDto, password: 'hashed_password', registrationDate: new Date() });
    });
});
