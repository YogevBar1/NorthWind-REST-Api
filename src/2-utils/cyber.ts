import { ForbiddenError, UnauthorizedError } from "../3-models/error-models";
import RoleModel from "../3-models/role-model";
import UserModel from "../3-models/user-model";
import jwt from "jsonwebtoken";


// Token secret key:
const tokenSecretKey = "The-Amazing-Full-Stack-Student";
function getNewToken(user: UserModel): string{

    // Container for user object inside the token:
    const container = {user};

    // Expiration
    const options ={expiresIn: "3h"};

    // Create token:
    const token = jwt.sign(container, tokenSecretKey, options);

    // Return token:
    return token;
}

// Verify legal token
function verifyToken(token: string): void{

    if(!token) throw new UnauthorizedError("Missing JWT Token");

    try{
    jwt.verify(token, tokenSecretKey);
    }

    catch(err:any){
        throw new UnauthorizedError(err.message);
    }

}

// Verify legal token
function verifyAdmin(token: string): void{
    
    // Verify legal token:
    verifyToken(token);

    // Get container
    const container = jwt.verify(token, tokenSecretKey) as {user: UserModel};

    // Extract user:
    const user : UserModel =  container.user;

    // Extract not admin:
    if(user.roleId !== RoleModel.Admin) throw new ForbiddenError ("You are not admin");

}


export default{
    getNewToken,
    verifyToken,
    verifyAdmin
}