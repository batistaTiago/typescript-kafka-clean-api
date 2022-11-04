import { GenericConstructor } from "../../../utils/generic-constructor-type";
import { ExpressControllerAdapter } from "./express-controller-adapter";
import { ExpressMiddleware } from "./middleware/express-middleware";

export interface ExpressRoute {
    method: string;
    url: string;
    controller: GenericConstructor<ExpressControllerAdapter>
    middleware?: Array<GenericConstructor<ExpressMiddleware>>
};