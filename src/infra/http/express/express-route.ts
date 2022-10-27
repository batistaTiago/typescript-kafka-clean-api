import { GenericConstructor } from "../../../utils/generic-constructor-type";
import { ExpressControllerAdapter } from "./express-controller-adapter";

export interface ExpressRoute {
    method: string;
    url: string;
    controller: GenericConstructor<ExpressControllerAdapter>
};