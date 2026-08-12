import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AppointmentService } from "./appointment.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const bookAppointment = catchAsync(
    (req : Request, res : Response) =>{

        const payload = req.body;
        const user = req.user;

        const result = AppointmentService.bookAppointment(payload, user);

        sendResponse(res, {
            httpStatusCode : status.CREATED,
            success : true,
            message : "book appointment creation done",
            data : result
        })
    }
)


export const AppointmentController = {
    bookAppointment,
}