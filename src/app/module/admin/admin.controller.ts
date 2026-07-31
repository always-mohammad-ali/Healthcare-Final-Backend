import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AdminService } from "./admin.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const softDeleteAdmin = catchAsync(
    async(req : Request, res : Response) =>{

        const { id } = req.params;
        const user = req.user;


        const result = await AdminService.softDeleteAdmin(id as string, user);

        sendResponse(res, {
            httpStatusCode : status.OK,
            success : true,
            message : "delete admin done",
            data : result
        })

    }
)








export const AdminController = {
    softDeleteAdmin
}