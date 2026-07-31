import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import z from "zod";
import { Gender, Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { UserZodValidation } from "./user.validation";
import { checkAuth } from "../../middleware/checkAuth";



const router = Router();

router.post("/create-doctor",

/*
    (req : Request, res : Response, next : NextFunction) =>{
        
      //  console.log("payload data from client BEFORE ZOD validation : ", req.body);

        const parsedResult = createDoctorZodSchema.safeParse(req.body);

        if(!parsedResult.success){
            
          //  console.log("ZOD validation error : ", parsedResult.error);

            next(parsedResult.error);
        }


        //sanitization : if any random data value integrated inside client payload, that will automatically diminish, and it will go for next.
        req.body = parsedResult.data;

       // console.log("payload data from client AFTER ZOD validation : ", req.body);

        next();
    },

*/
    validateRequest(UserZodValidation.createDoctorZodValidationSchema),
    
    UserController.createDoctor);

router.post("/create-admin",  validateRequest(UserZodValidation.createAdminZodValidationSchema), UserController.createAdmin);

router.post("/create-super-admin", validateRequest(UserZodValidation.createSuperAdminZodValidationSchema), UserController.createSuperAdmin);


export const UserRoute = router;