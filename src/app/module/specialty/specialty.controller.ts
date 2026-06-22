import { NextFunction, Request, Response } from "express";
import { SpecialtyService } from "./specialty.service";
import { RequestHandler } from "express";
import { catchAsync } from "../../shared/catchAsync";

const createSpecialty = catchAsync(
    async(req : Request, res : Response) =>{
    

        const payload = req.body;

        const result = await SpecialtyService.createSpecialty(payload);

        res.status(201).json({
            success : true,
            message : "specialty creation successful",
            data : result
        })
    
}
)

const getAllSpecialty = catchAsync(
    async(req : Request, res : Response) =>{
      

        const specialties = await SpecialtyService.getAllSpecialty();

        res.status(201).json({
            success : true,
            message : "successfully get all those specialty data",
            data : specialties
        })

      
}
)



const updateSpecialty = catchAsync(
    async(req : Request, res : Response) =>{

         const {id} = req.params;
        const payload = req.body;

        const result = await SpecialtyService.updateSpecialty(payload, id as string);

        res.status(201).json({
            success : true,
            message : "successfully update specialty data",
            data : result
        })

    }
)

const deleteSpecialty = catchAsync(
    async(req : Request, res : Response) =>{
     

        const {id}  = req.params;

        const result = await SpecialtyService.deleteSpecialty(id as string);

        res.status(201).json({
            success : true,
            message : "successfully delete specialty data by id",
            data : result
        })

      
}
)

export const SpecialtyController = {
    createSpecialty, 
    getAllSpecialty,
    updateSpecialty,
    deleteSpecialty
}