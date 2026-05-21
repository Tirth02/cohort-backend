import ApiError from "../../common/utils/api-error.js";
import generateResetToken from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js"

const register = async ({name, email, password, role}) => {
    //do user registration
    
    const existingUser = await User.findOne({email});
    if(existing)
    {
        throw ApiError.conflict("Email already exists");
    }

    const {rawToken, hashedToken }  = generateResetToken();

    const user = await User.create({
        name,
        email,
        password,
        role,
        verificationToken: hashedToken
    })

    //TODO: send an email to user with token: rawToken

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.verificationToken


    return userObj

}

export {register}