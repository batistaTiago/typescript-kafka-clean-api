import { Controller } from "./controller";
import { ErrorResilientController } from "./error-resilient-controller"
import { HttpRequest } from "./http-request";
import { HttpResponse } from "./http-response";

class FakeController implements Controller {
    async handle(request?: HttpRequest): Promise<HttpResponse> {
        return null;
    }
}

const sampleData = { sample: 'object', with: ['many', 'layers', 'of', 'depth']};

describe('ErrorResilientController', () => {
    it('should return a valid http response object even if decorated controller throws', async () => {
        const controller = new FakeController();
        jest.spyOn(controller, 'handle').mockImplementationOnce(() => {
            throw new Error('Error message...');
        });

        const sut = new ErrorResilientController(controller);

        const response = await sut.handle({
            body: sampleData
        });

        expect(response.statusCode).toEqual(500);
        expect(response.body.error).toBeDefined();
    });

    it('should forward call into decorated controller', async () => {
        const controller = new FakeController();
        const handleSpy = jest.spyOn(controller, 'handle');

        const sut = new ErrorResilientController(controller);

        await sut.handle({ body: sampleData });

        expect(handleSpy).toHaveBeenLastCalledWith({ body: sampleData });
    });
})