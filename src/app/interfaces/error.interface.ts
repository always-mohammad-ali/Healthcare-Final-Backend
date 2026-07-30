
export interface TErrorSources {
    path : string;                //why is it just path and message? why not something more or else? could i use those?
    message : string;
}

export interface TErrorResponse{
    statusCode ?: number;
    success : boolean;
    message : string;
    errorSources : TErrorSources[];
    stack?: string;                    //if stack gives back line that where does that error happens, theen why it is string?   
    error?: unknown;                   
     
}