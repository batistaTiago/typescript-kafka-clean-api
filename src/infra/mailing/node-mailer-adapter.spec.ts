import { Mailable } from "../../domain/services/mailing/mailable";
import { NodeMailerAdapter } from "./node-mailer-adapter";
import Environment from "../../application/environment";
import * as NodeMailer from 'nodemailer';

jest.mock("nodemailer");

describe('NodeMailerAdapter', () => {
    
    it('should call library with correct values', async () => {
        const transportMock = { sendMail: jest.fn() };
        const sendMailMock = jest.spyOn(transportMock, 'sendMail');
        jest.spyOn<any, any>(NodeMailer, 'createTransport').mockReturnValueOnce(transportMock);

        const sut = new NodeMailerAdapter(transportMock as any);
        const mailable: Mailable = {
            subject: 'automated-test',
            message: 'this is an automatically generated test message',
        };

        await sut.send(mailable, 'target@test.dev');

        expect(sendMailMock).toHaveBeenCalledWith({
            from: Environment.MAIL_FROM,
            to: 'target@test.dev',
            subject: mailable.subject,
            html: mailable.message
        });
    });

    it('should throw if library throws', async () => {
        const transportMock = { 
            sendMail: jest.fn().mockImplementationOnce(() => {
                throw new Error();
            }) 
        };
        jest.spyOn(transportMock, 'sendMail');
        jest.spyOn<any, any>(NodeMailer, 'createTransport').mockReturnValueOnce(transportMock);
        
        const sut = new NodeMailerAdapter(transportMock as any);
        const mailable: Mailable = {
            subject: 'automated-test',
            message: 'this is an automatically generated test message',
        };

        const promise = sut.send(mailable, 'target@test.dev');
        expect(promise).rejects.toThrow();
    });
});