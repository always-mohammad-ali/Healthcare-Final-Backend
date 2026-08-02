import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelpers/AppError";
import { CookieUtils } from "../../utils/cookie";

const registerPatient = catchAsync(
    async(req : Request, res : Response) =>{
        const payload = req.body;
        //console.log(payload);

        const result = await AuthService.registerPatient(payload);

        const {accessToken, refreshToken, token, ...rest} = result;

        tokenUtils.setAccessTokenInsideCookie(res, accessToken);
        tokenUtils.setRefreshTokenInsideCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionInsideCookie(res, token as string);

        sendResponse(res, {
            httpStatusCode : status.CREATED,
            success : true,
            message : "patient registration successfully done",
            //data : result
            data : {
                token,
                accessToken,
                refreshToken,
                ...rest
            }
        })
    }
)

const loginUser = catchAsync(
    async(req : Request, res : Response) =>{
        const payload = req.body;
      
        const result = await AuthService.loginUser(payload);

        const {accessToken, refreshToken, token, ...rest} = result;

        tokenUtils.setAccessTokenInsideCookie(res, accessToken);
        tokenUtils.setRefreshTokenInsideCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionInsideCookie(res, token);

        sendResponse(res, {
            httpStatusCode : status.OK,
            success : true,
            message : "user login successfull",
           // data : result
           data : {
            token,
            accessToken,
            refreshToken,
            ...rest
           }
        })

    }
)


const getMe = catchAsync(
    async(req : Request, res : Response) =>{
        const user = req.user;

        const result = await AuthService.getMe(user);

        sendResponse(res, {
            httpStatusCode : status.OK,
            success : true,
            message : "get me individual profile done",
            data : result
        })
    }
)


const getNewToken = catchAsync(
    async(req : Request, res : Response) =>{
        const refreshToken = req.cookies.refreshToken;
        const betterAuthSessionToken = req.cookies["better-auth.session_token"];

        if(!refreshToken){
            throw new AppError(status.UNAUTHORIZED, "didn't get the refresh token");
        }

        const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken);

        const {newRefreshToken, token, newAccessToken} = result;

        tokenUtils.setAccessTokenInsideCookie(res, newAccessToken);
        tokenUtils.setRefreshTokenInsideCookie(res, newRefreshToken);
        tokenUtils.setBetterAuthSessionInsideCookie(res, token);


        sendResponse(res, {
            httpStatusCode : status.OK,
            success : true,
            message : "get new token done",
            data : {newAccessToken, newRefreshToken, token}
        })

    }
)


const changePassword = catchAsync(
    async(req : Request, res : Response) =>{

        const payload = req.body;
        const betterAuthSessionToken = req.cookies["better-auth.session_token"];

        const result = await AuthService.changePassword(payload, betterAuthSessionToken);

        const {accessToken, refreshToken, token} = result;

        tokenUtils.setAccessTokenInsideCookie(res, accessToken);
        tokenUtils.setRefreshTokenInsideCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionInsideCookie(res, token as string);


        sendResponse(res, {
            httpStatusCode : status.OK,
            success : true,
            message : "change password done successfully",
            data : {
                token,
                accessToken, 
                refreshToken,
                result,
                
            }
        })

    }
)

const logOutUser = catchAsync(
    async(req : Request, res : Response) =>{

        const betterAuthSessionToken = req.cookies["better-auth.session_cookie"];

        const result = await AuthService.logOutUser(betterAuthSessionToken);

        CookieUtils.clearCookie(res, 'accessToken', {
            httpOnly : true,
            secure : true,
            sameSite : "none"
        })

        CookieUtils.clearCookie(res, 'refreshToken', {
            httpOnly : true,
            secure : true,
            sameSite : "none"
        })

        CookieUtils.clearCookie(res, 'better-auth.session_token', {
            httpOnly : true,
            secure : true,
            sameSite : "none"
        })

        sendResponse(res, {
            httpStatusCode : status.OK,
            success : true,
            message : "user logout successfully",
            data : result
        })
    }
)

const verifyEmail = catchAsync(
    async(req : Request, res : Response) =>{
        const {email, otp} = req.body;
        await AuthService.verifyEmail(email, otp);

        sendResponse(res, {
            httpStatusCode : status.OK,
            success : true,
            message : "email verified done"
        })
    }
)


const forgetPassword = catchAsync(
    async(req : Request, res : Response) =>{
        const {email} = req.body;

        await AuthService.forgetPassword(email);

        sendResponse(res, {
            httpStatusCode : status.OK,
            success : true,
            message : "forget password otp send done, now go to reset-password and change it with that otp"
        })
    }
)


const resetPassword = catchAsync(
    async(req : Request, res : Response) =>{

        const {email, otp, newPassword} = req.body;

        await AuthService.resetPassword(email, otp, newPassword);

        sendResponse(res, {
            httpStatusCode : status.OK,
            success : true,
            message : "reset password done with new otp and email"
        })
    }
)





export const AuthController = {
    registerPatient,
    loginUser, 
    getMe,
    getNewToken,
    changePassword,
    logOutUser,
    verifyEmail,
    forgetPassword,
    resetPassword
}
