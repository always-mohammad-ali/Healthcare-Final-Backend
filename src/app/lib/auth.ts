import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Role, UserStatus} from "../../generated/prisma/client";
import { prisma } from "./prisma";
import ms from "ms";
import { envVar } from "../config/env";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";
// If your Prisma file is located elsewhere, you can change the path
//import { PrismaClient } from "@/generated/prisma/client"; we don't need this because we have prisma client

//const prisma = new PrismaClient(); we don't also need this line too.
export const auth = betterAuth({
    baseURL : envVar.BETTER_AUTH_URL,
    secret : envVar.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),

    emailAndPassword : {
        enabled : true,
        requireEmailVerification : true,  
    },
    
    socialProviders : {
        google : {
            clientId : envVar.GOOGLE_CLIENT_ID,
            clientSecret : envVar.GOOGLE_CLIENT_SECRET,

            mapProfileToUser: () => {
                return {
                    role : Role.PATIENT,
                    status : UserStatus.ACTIVE,
                    needPasswordChange : false,
                    emailVerified : true,
                    isDeleted : false,
                    deletedAt : null,
                }
            },
        }

    },

    emailVerification : {
         sendOnSignUp : true,
         sendOnSignIn : true,
         autoSignInAfterVerification : true
    },

    user : {
        additionalFields : {
            role : {
                type : "string",
                required : true,
                defaultValue : Role.PATIENT
            },

            status : {
                type : "string",
                required : true,
                defaultValue : UserStatus.ACTIVE
            },

            needPasswordChange : {
                type : "boolean",
                required : true,
                defaultValue : false
            },
            isDeleted : {
                type : "boolean",
                required : true,
                defaultValue : false
            },
            deletedAt : {
                type : "date",
                required : false,
                defaultValue : null
            }

        }
    },

    plugins : [
        bearer(),
        emailOTP({
            overrideDefaultEmailVerification : true,
            async sendVerificationOTP({email, otp, type}){
               if(type === "email-verification"){
                const user = await prisma.user.findUnique({
                    where : {email}
                })

                if(user && !user.emailVerified){
                    sendEmail({
                        to : email,
                        subject : "verify your email",
                        templateName : "otp",
                        templateData : {
                            name : user.name,
                            otp
                        }
                    })
                }
               }else if(type === "forget-password"){
                    const user = await prisma.user.findUnique({
                        where : {email}
                    })

                    if(user){
                        sendEmail({
                            to : email,
                            subject :"forget password otp",
                            templateName : "otp",
                            templateData : {
                                name : user.name,
                                otp
                            }
                        })
                    }
                }

            },
            expiresIn : 2 * 60,
            otpLength : 6,
        }),
    ],


    session : {
    /*   expiresIn : Number(ms(Number(envVar.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN))),
        updateAge : Number(ms(Number(envVar.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE))),
        cookieCache :{
            enabled : true,
            maxAge : Number(ms(Number(envVar.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN)))
     */

        expiresIn : 24 * 60 * 60,     // 1 day
        updateAge : 24 * 60 * 60,
        cookieCache :{
            enabled : true,
            maxAge : 24 * 60 * 60

        }
    },

    redirectURLs : {
        signIn : `${envVar.BETTER_AUTH_URL}/api/v1/auth/google/success`,
    },


    trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:5000", envVar.FRONTEND_URL],

     advanced: {
        // disableCSRFCheck: true,
        useSecureCookies : false,

        cookies : {
            state:{
                attributes:{
                    sameSite : "none",
                    secure : true,
                    httpOnly : true,
                    path : "/"
                }
            },
            sessionToken:{
                attributes:{
                    sameSite : "none",
                    secure : true,
                    httpOnly : true,
                    path : "/"
                }
            }
        }
     }
  
 

});