import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { UserService } from "./user.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";


const createDoctor = catchAsync(
        async(req : Request, res : Response) =>{
      
        const payload = req.body;

        const result = await UserService.createDoctor(payload);
        
        const {accessToken, refreshToken, token, ...rest} = result;

        tokenUtils.setAccessTokenInsideCookie(res, accessToken);
        tokenUtils.setRefreshTokenInsideCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionInsideCookie(res, token as string);


        sendResponse(res, {
          httpStatusCode : status.CREATED,
          success : true,
          message : "successfully registered  doctor profile data",
          data : {
            accessToken,
            refreshToken,
            token,
            ...rest
          }
        })

      
}
)

export const UserController = {
    createDoctor
}