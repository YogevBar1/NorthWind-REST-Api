import {Request, Response,NextFunction} from "express";
import StatusCode from "../3-models/status-code";
import { UnauthorizedError } from "../3-models/error-models";

// Allow entrance only for our system
function verbose(request: Request , response: Response, next: NextFunction): void{

    const doormanKey ="I-Love-kittens!";

    // If request don`t have doorman key value (maybe a hacker)
    if(request.header("doormanKey")!== doormanKey){
        // response.status(StatusCode.Unauthorized).send("You are not authorized!");
        next(new UnauthorizedError("You are not authorized!"));
        return;

    }

    // Request containing the doorman key
    next();

}

export default verbose;