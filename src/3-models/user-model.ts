import Joi from "joi";
import RoleModel from "./role-model";
import { ValidationError } from "./error-models";

class UserModel{

    public id: number;
    public firstName: string;
    public lastName: string;
    public username: string;
    public password: string;
    public roleId: RoleModel;

    public constructor(user: UserModel){    //Copy-constructor
        this.id=user.id;
        this.firstName=user.firstName;
        this.lastName=user.lastName;
        this.username=user.username;
        this.password=user.password;
        this.roleId=user.roleId;

    }

    // Validation schema:
    private static validationSchema = Joi.object({
        id: Joi.number().optional().integer().positive(),
        firstName: Joi.string().required().min(2).max(50),
        lastName: Joi.string().required().min(2).max(50),
        username: Joi.string().required().min(4).max(50),
        password: Joi.string().required().min(4).max(50),
        roleId: Joi.number().required().min(1).max(2).integer(),
    });

    // Validate proporties and throw if not valid
    public validate(): void{
        const result = UserModel.validationSchema.validate(this);
        if(result.error?.message) throw new ValidationError(result.error.message);
    }
}

export default UserModel;