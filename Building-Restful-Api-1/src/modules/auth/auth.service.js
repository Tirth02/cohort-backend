import ApiError from "../../common/utils/api-error.js";
import generateResetToken, { generateAccessToken, generateRefreshToken } from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js"

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

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

const login = async({email,password}) => {
    const user = await User.findOne({email}).select("+password");
    if(!user)
    {
        throw ApiError.unauthorized("Invalid email or password");
    }

    // somehow i will check password

    if(!user.isVerified)
    {
        throw ApiError.forbidden("Please verify your email before login!!");
    }

    const accessToken = generateAccessToken({id:user._id, role: user.role});
    const refreshToken = generateRefreshToken({id: user._id});

    user.refreshToken =  hashToken(refreshToken);
    await user.save({validateBeforeSave: false});

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;
    return{user: userObj, accessToken, refreshToken};

}

export {register}