import * as authService from "./auth.service.js"
import ApiResponse from "../../common/utils/api-response.js";


const register = async(req,res) => {
    const user = await authService.register(req.body);
    ApiResponse.created(res,"Registration success", user);
}

const login = async(req,res) => {
    const {user, accessToken, refreshToken} = await authService.login(req.body);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    ApiResponse.ok(res,"Login Successful", {user,accessToken})

}

const logout = async(req,res) => {
    await authService.logOut(req.user.id);
    res.clearCookie("refreshToken");

    ApiResponse.ok(res,"Logout Success")
}

const getMe = async(req, res) => {
    const user = await authService.getMe(req.user.id);
    ApiResponse.ok(res,"User fetched successfully", user); 
}

export {register, login, logout, getMe}