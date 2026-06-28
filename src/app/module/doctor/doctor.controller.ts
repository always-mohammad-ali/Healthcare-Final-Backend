import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { DoctorService } from "./doctor.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";


const getAllDoctor = catchAsync(
     async(req : Request, res : Response) =>{
      
        const result = await DoctorService.getAllDoctor();


        sendResponse(res, {
          httpStatusCode : status.OK,
          success : true,
          message : "successfully get all those doctor data",
          data : result
        })

      
}
)

export const DoctorController = {
    getAllDoctor
}