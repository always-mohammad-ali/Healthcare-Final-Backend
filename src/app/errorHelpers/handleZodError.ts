import status from "http-status";
import z from "zod";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interface";

export const handleZodError = (err : z.ZodError) : TErrorResponse =>{  //what is the purpose of  handleZodError file? why is that? how to do that?
        const statusCode = status.BAD_REQUEST;
        const message = "zod validation error";
        const errorSources : TErrorSources[] = [];  //why does it array? does so many error possible? what is the relation of zod and this zodError?
    
            err.issues.forEach((issue) =>{     // where does that issues come from? is it built in something? 
                errorSources.push({            // why are we pushing inside errorSources?
                    path : issue.path.join(" => "),
                    message : issue.message    // is this message from above "zod validation error"?
                })
            })

            return {                  //why are we returing like that way? whom are we returning this value? 
                success : false,      //what is the connection between globalErrorHandler and this handleZodError?
                message,
                errorSources,
                statusCode
            }
}