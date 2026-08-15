import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { PatientService } from "./patient.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const updateMyProfile = catchAsync(
   async (req : Request, res : Response) =>{

        const payload = req.body;
        const user = req.user;


        const result = await PatientService.updateMyProfile(payload, user);

        sendResponse(res, {
            httpStatusCode : status.OK,
            success : true,
            message : "update my profile successful",
            data : result
        })
    }
)

export const PatientController = {
    updateMyProfile
}