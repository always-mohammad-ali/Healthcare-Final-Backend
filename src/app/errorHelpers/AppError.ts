//this is class, so that's why its file name starts with capital letter

class AppError extends Error {
    public statusCode : number;

    constructor(statusCode : number, message : string, stack = ''){
        super(message)
        this.statusCode = statusCode;

        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}


export default AppError;