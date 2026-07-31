import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { CookieUtils } from "../utils/cookie";
import AppError from "../errorHelpers/AppError";
import { prisma } from "../lib/prisma";
import status from "http-status";
import { jwtUtils } from "../utils/jwt";
import { envVar } from "../config/env";

export const checkAuth = (...authRoles : Role[]) => async(req : Request, res : Response, next : NextFunction) =>{

    console.log("Cookies:", req.cookies);
    console.log("Headers:", req.headers.cookie);
       
    try{

        //BETTER-AUTH SESSION TOKEN VERIFICATION

        const sessionToken = CookieUtils.getCookie(req, "better-auth.session_token");
        console.log(sessionToken);

        if(!sessionToken){
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! No session token provided");
        }

        if(sessionToken){
            const sessionExists = await prisma.session.findFirst({
                where : {
                    token : sessionToken,
                    expiresAt : {
                        gt : new Date(),
                    }
                },
                include : {
                    user : true,
                }
            })

            if(sessionExists && sessionExists.user){
                const user = sessionExists.user;

                const now = new Date();
                const expiresAt = new Date(sessionExists.expiresAt);
                const createdAt = new Date(sessionExists.createdAt);

                const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
                const timeRemaining = expiresAt.getTime() - now.getTime();
                const percentRemaining = ( timeRemaining / sessionLifeTime ) * 100;

                if(percentRemaining < 20){
                    res.setHeader('X-Session-Refresh', 'true');
                    res.setHeader('X-Session-Expires-At', expiresAt.toISOString());
                    res.setHeader('X-Time-Remaining', timeRemaining.toString());


                    console.log("Session Expiring Soon");
                }

                if(user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED){
                    throw new AppError(status.UNAUTHORIZED, "Unauthorized access! User is not active or blocked");
                }

                if(user.isDeleted){
                    throw new AppError(status.UNAUTHORIZED, 'user is deleted')
                }

                if(authRoles.length > 0 && !authRoles.includes(user.role)){
                    throw new AppError(status.FORBIDDEN, "Forbidden access, you don't have permission to access this routes and resources");
                }


                req.user = {
                    userId : user.id,
                    email : user.email,
                    role : user.role
                }


            }
        }


        //ACCESS TOKEN VERIFICATION
        const accessToken = CookieUtils.getCookie(req, 'accessToken');

        if(!accessToken){
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! No access token provided.');
        }

        const verifyToken = jwtUtils.verifyToken(accessToken, envVar.ACCESS_TOKEN_SECRET);

        if(!verifyToken.success){
            throw new AppError(status.UNAUTHORIZED, "Invalid access token");
        }

        if(authRoles.length > 0 && !authRoles.includes(verifyToken.data!.role as Role)){
            throw new AppError(status.FORBIDDEN, "You don't have permission to access this routes and resources");
        }


        next();
        
    }catch(error : any){
        next(error);
    }
}