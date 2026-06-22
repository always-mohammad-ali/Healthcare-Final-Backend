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

const getAllSpecialty = async(req : Request, res : Response) =>{
      try{

        const specialties = await SpecialtyService.getAllSpecialty();

        res.status(201).json({
            success : true,
            message : "successfully get all those specialty data",
            data : specialties
        })

      }catch(error){
        res.status(404).json({
            success : false,
            message : "failed to get all specialty data",
            error : error
        })
      }
}

const updateSpecialty = async(req : Request, res : Response) =>{
    try{
        const {id} = req.params;
        const payload = req.body;

        const result = await SpecialtyService.updateSpecialty(payload, id as string);

        res.status(201).json({
            success : true,
            message : "successfully update specialty data",
            data : result
        })


    }catch(error){
       res.status(404).json({
            success : false,
            message : "failed to update specialty data",
            error : error
        })
    }
}

const deleteSpecialty = async(req : Request, res : Response) =>{
     try{

        const {id}  = req.params;

        const result = await SpecialtyService.deleteSpecialty(id as string);

        res.status(201).json({
            success : true,
            message : "successfully delete specialty data by id",
            data : result
        })

      }catch(error){
        res.status(404).json({
            success : false,
            message : "failed to delete specialty data",
            error : error
        })
      }
}

export const SpecialtyController = {
    createSpecialty, 
    getAllSpecialty,
    updateSpecialty,
    deleteSpecialty
}