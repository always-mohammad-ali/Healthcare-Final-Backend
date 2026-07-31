import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelpers/AppError";

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
        const betterAuthSessionToken = req.cookies["better_auth.session-token"];

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



export const AuthController = {
    registerPatient,
    loginUser, 
    getMe,
    getNewToken
}