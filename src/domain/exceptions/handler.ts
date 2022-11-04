import { injectable } from "tsyringe";
import { AppError } from "./app-error";

@injectable()
export class ErrorHandler {
    handle(error: Error) {

    }

    isAppError(error: Error): boolean {
        return error instanceof AppError;
    }
}