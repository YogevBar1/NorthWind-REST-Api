import Joi from "joi";
import RoleModel from "./role-model";
import { ValidationError } from "./error-models";

class CredentialsModel{


    public username: string;
    public password: string;

    public constructor(user: CredentialsModel){    //Copy-constructor

        this.username=user.username;
        this.password=user.password;

    }

    // Validation schema:
    private static validationSchema = Joi.object({

        username: Joi.string().required().min(4).max(50),
        password: Joi.string().required().min(4).max(50),
    });

    // Validate proporties and throw if not valid
    public validate(): void{
        const result = CredentialsModel.validationSchema.validate(this);
        if(result.error?.message) throw new ValidationError(result.error.message);
    }
}

export default CredentialsModel;