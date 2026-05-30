import ApiError from "../../common/utils/api-error.js";
import generateResetToken, { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../common/utils/jwt.utils.js";
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

const refresh = async(token) =>{
    if(!token) throw ApiError.unauthorized("Refresh token is missing");

    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id).select("+refreshToken");  

    if(!user) throw ApiError.unauthorized("User not found while refreshing....");

    if(user.refreshToken !== hashToken(token))
    {
        throw ApiError.unauthorized("Invalid Refresh token");
    }

    const accessToken = generateAccessToken({id: user._id, role: user.role});

    return {accessToken}
}

const logOut = async(userId) => {
    
    // const user = await User.findById(userId);

    // if(!user) throw ApiError.unauthorized("User not found");

    // user.refreshToken = undefined;

    // await user.save({ validateBeforeSave: false});

    await User.findByIdAndUpdate(userId, {refreshToken: null});

}

const forgotPassword = async(email) => {
    const user  = await User.findOne({email});

    if(!user) throw ApiError.notfound("User not found with this email");

    const {rawToken, hashedToken} = generateResetToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; //10 mins

    await user.save({validateBeforeSave: false});
}

export {register}