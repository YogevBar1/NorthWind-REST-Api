import {Request, Response,NextFunction} from "express";
import StatusCode from "../3-models/status-code";
import { UnauthorizedError } from "../3-models/error-models";
import cyber from "../2-utils/cyber";

// verify token validity
function verifyToken(request: Request , response: Response, next: NextFunction): void{

    // Authorization: "Bearer the-token"
    const authorizationHeader = request.header("authorization");

    // Extract the token
    const token = authorizationHeader?.substring(7);

    // Verify token
    cyber.verifyToken(token);

    next();

}

export default verifyToken;