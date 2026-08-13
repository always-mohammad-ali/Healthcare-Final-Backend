import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AppointmentService } from "./appointment.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const bookAppointment = catchAsync(
   async (req : Request, res : Response) =>{

        const payload = req.body;
        const user = req.user;

        const result = await AppointmentService.bookAppointment(payload, user);

        sendResponse(res, {
            httpStatusCode : status.CREATED,
            success : true,
            message : "book appointment creation done",
            data : result
        })
    }
)


const bookAppointmentWithPaylater = catchAsync(
    async(req : Request, res : Response) =>{
         const payload = req.body;
         const user = req.user;

         const result = await AppointmentService.bookAppointmentWithPaylater(payload, user);

         sendResponse(res,{
            httpStatusCode : status.OK,
            success : true,
            message : "appointment done",
            data : result
         })
    }
)

const initiatePayment = catchAsync(
    async(req : Request, res : Response) =>{

        const {appointmentId} = req.params;
        const user = req.user;

        const result = await AppointmentService.initiatePayment(appointmentId as string, user);

         sendResponse(res,{
            httpStatusCode : status.OK,
            success : true,
            message : "initiate payment done",
            data : result
         })
    }
)

export const AppointmentController = {
    bookAppointment,
    bookAppointmentWithPaylater,
    initiatePayment
}