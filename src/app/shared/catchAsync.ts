import { NextFunction, Request, RequestHandler, Response } from "express";

export const catchAsync = (fn : RequestHandler) =>{
   return async(req : Request, res : Response, next : NextFunction) =>{
    try{

       await fn(req, res, next);

    }catch(error){
         res.status(404).json({
            success : false,
            message : "failed to fetch",
            error : error
        })
    }
  }
}