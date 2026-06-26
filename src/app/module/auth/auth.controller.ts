import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";

const registerPatient = catchAsync(
    async(req : Request, res : Response) =>{
        const payload = req.body;
        console.log(payload);

        const result = await AuthService.registerPatient(payload);

        sendResponse(res, {
            httpStatusCode : 201,
            success : true,
            message : "patient registration successfully done",
            data : result
        })
    }
)



export const AuthController = {
    registerPatient
}