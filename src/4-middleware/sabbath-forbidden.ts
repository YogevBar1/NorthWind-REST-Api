import { Request, Response, NextFunction } from "express";
import StatusCode from "../3-models/status-code";

// Allow entrance only for our system
function sabbathForbidden(request: Request, response: Response, next: NextFunction): void {


    const day = new Date().getDay();

    if (day === 6) {
        response.status(StatusCode.Forbidden).send("The Store close in Sabbath");
        return;

    }

    // Request containing 
    next();

}

export default sabbathForbidden;