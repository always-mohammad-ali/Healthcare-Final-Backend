import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Role, UserStatus} from "../../generated/prisma/client";
import { prisma } from "./prisma";
import ms from "ms";
import { envVar } from "../config/env";
// If your Prisma file is located elsewhere, you can change the path
//import { PrismaClient } from "@/generated/prisma/client"; we don't need this because we have prisma client

//const prisma = new PrismaClient(); we don't also need this line too.
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),

    emailAndPassword : {
        enabled : true
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

    session : {
        expiresIn : Number(ms(Number(envVar.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN))),
        updateAge : Number(ms(Number(envVar.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE))),
        cookieCache :{
            enabled : true,
            maxAge : Number(ms(Number(envVar.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN)))
        }
    }

/*
    trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:5000"],

     advanced: {
         disableCSRFCheck: true,
     }
  
 */

});