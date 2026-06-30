import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";

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



export const AuthController = {
    registerPatient,
    loginUser
}