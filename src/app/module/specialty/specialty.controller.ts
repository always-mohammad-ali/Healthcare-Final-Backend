import { Request, Response } from "express";
import { SpecialtyService } from "./specialty.service";

const createSpecialty = async(req : Request, res : Response) =>{
    try{

        const payload = req.body;

        const result = await SpecialtyService.createSpecialty(payload);

        res.status(201).json({
            success : true,
            message : "specialty creation successful",
            data : result
        })

    }catch(error){
        res.status(401).json({
            success : false,
            message : "failed to create specialty",
            error : error
        })
    }
}

export const SpecialtyController = {
    createSpecialty
}