import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
    PORT : string,
    NODE_ENV : string,
    DATABASE_URL : string,
    BETTER_AUTH_SECRET : string,
    BETTER_AUTH_URL : string
}



const loadEnvVariable = () : EnvConfig =>{
    
    const requireEnvVariable = [
        'PORT',
        'NODE_ENV',
        'DATABASE_URL',
        'BETTER_AUTH_SECRET',
        'BETTER_AUTH_URL'
    ];

    requireEnvVariable.forEach((variable) =>{
        if(!process.env[variable]){
            throw new Error(`Environment variable ${variable} is required, but it is not set in env.ts file.`)
        }
    })


    return {
        PORT : process.env.PORT as string,
        NODE_ENV : process.env.NODE_ENV as string,
        DATABASE_URL : process.env.DATABASE_URL as string,
        BETTER_AUTH_SECRET : process.env.BETTER_AUTH_SECRET as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_SECRET as string
    }
    
}


export const envVar = loadEnvVariable();


 