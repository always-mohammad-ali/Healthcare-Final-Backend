import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createMyDoctorSchedule = catchAsync(
    (req : Request, res : Response) =>{
        const payload = req.body;
        const user = req.user;

        const result = DoctorScheduleService.createMyDoctorSchedule(payload, user);

        sendResponse(res, {
            httpStatusCode : status.CREATED,
            success : true,
            message : "doctor schedule creation done",
            data : result
        })
    }
)

const updateDoctorSchedule = catchAsync(
    (req : Request, res : Response) =>{
        const payload = req.body;
        const user = req.user;

        const result = DoctorScheduleService.createMyDoctorSchedule(payload, user);

        sendResponse(res, {
            httpStatusCode : status.CREATED,
            success : true,
            message : "doctor schedule creation done",
            data : result
        })
    }
)


export const DoctorScheduleController = {
    createMyDoctorSchedule,
    updateDoctorSchedule
}