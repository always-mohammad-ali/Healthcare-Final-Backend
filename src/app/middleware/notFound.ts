
import { Request, Response } from "express";
import status from "http-status";

export const notFound = async(req : Request, res : Response) =>{
    res.send(status.NOT_FOUND).json({
        success : false,
        message : `Route ${req.originalUrl} not found`,
    })
}