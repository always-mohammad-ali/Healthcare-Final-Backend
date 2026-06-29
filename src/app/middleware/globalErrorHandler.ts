import { NextFunction, Request, Response } from "express";
import { envVar } from "../config/env";
import { success } from "better-auth";
import status from "http-status";
import z from "zod";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";



//Zod Error Patttern  from zod website basic usage
    /*
     error.issues; 
    /* [
      {
        expected: 'string',
        code: 'invalid_type',
        path: [ 'username' , 'password' ], => username password
        message: 'Invalid input: expected string'
      },
      {
        expected: 'number',
        code: 'invalid_type',
        path: [ 'xp' ],
        message: 'Invalid input: expected number'
      }
    ] 
    */

export const globalErrorHandler = (err : any, req : Request, res : Response, next : NextFunction) =>{
    if(envVar.NODE_ENV === "development"){
        console.log("Error from global error handler", err);
    }
    
    let errorSources : TErrorSources[] = [];

    let statusCode : number = status.INTERNAL_SERVER_ERROR;
    let message : string = "Internal Server Error"

    if(err instanceof z.ZodError){
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode as number;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
    }

    const errorResponse : TErrorResponse = {
        success : false,
        message : message,
        errorSources,
        error : envVar.NODE_ENV === 'development' ? err : undefined,
    }
    
    res.status(statusCode).json(errorResponse);
}