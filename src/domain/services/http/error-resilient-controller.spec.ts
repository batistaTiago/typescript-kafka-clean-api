import { AppError } from "../../exceptions/app-error";
import { Controller } from "./controller";
import { ErrorResilientController } from "./error-resilient-controller"
import { HttpRequest } from "./http-request";
import { HttpResponse } from "./http-response";
import { HttpStatus } from "./status";

class FakeController implements Controller {
    async handle(request?: HttpRequest): Promise<HttpResponse> {
        return null;
    }
}

const sampleData = { sample: 'object', with: ['many', 'layers', 'of', 'depth']};

describe('ErrorResilientController', () => {
    it('should return a server error response if decorated controller throws an unknown error', async () => {
        const controller = new FakeController();
        jest.spyOn(controller, 'handle').mockImplementationOnce(() => {
            throw new Error('Error message...');
        });

        const sut = new ErrorResilientController(controller);

        const response = await sut.handle({
            body: sampleData
        });

        expect(response.statusCode).toEqual(HttpStatus.SERVER_ERROR);
        expect(response.body.error).toEqual('Unexpected server error, please try again later');
    });

    it('should return a client error response if decorated controller throws an app error', async () => {
        const controller = new FakeController();
        jest.spyOn(controller, 'handle').mockImplementationOnce(() => {
            throw new AppError('Error message...');
        });

        const sut = new ErrorResilientController(controller);

        const response = await sut.handle({
            body: sampleData
        });

        expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(response.body.error).toBe('Error message...');
    });

    it('should forward call into decorated controller', async () => {
        const controller = new FakeController();
        const handleSpy = jest.spyOn(controller, 'handle');

        const sut = new ErrorResilientController(controller);

        await sut.handle({ body: sampleData });

        expect(handleSpy).toHaveBeenLastCalledWith({ body: sampleData });
    });
})