import { NextFunction, Request, Response } from "express";
import { envVar } from "../config/env";
import { success } from "better-auth";
import status from "http-status";

export const globalErrorHandler = (err : any, req : Request, res : Response, next : NextFunction) =>{
    if(envVar.NODE_ENV === "development"){
        console.log("Error from global error handler", err);
    }
    
    const statusCode : number = status.INTERNAL_SERVER_ERROR;
    const message : string = "Internal Server Error"
    
    res.status(statusCode).json({
        success : false,
        message : message,
        error : err.message
    });
}