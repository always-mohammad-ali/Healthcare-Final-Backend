import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

const createDoctorZodSchema = z.object({
    password : z.string("password is required").min(6, "password must be at least 6 char").max(20, 
        "password could be at most 20 char"),

    doctor : z.object({
    name : z.string("string name is required").min(6, "name must be at least 6 char").max(100, "name could be at most 100 char"),

    email : z.email("invalid email address"),

    contactNumber: z.string("Contact number is required").min(11, "Contact number must be at least 11 characters").max(14, 
        "Contact number must be at most 15 characters"),

    address : z.string("string address is required").min(6, "address must be at least 6 char").max(100, 
        "address could be at most 100 char").optional(),

    registrationNumber: z.string("Registration number is required"),

    experience : z.int("Integer experience required").nonnegative("exp could not be negative number").optional(),
    gender : z.enum([Gender.MALE, Gender.FEMALE], "Gender must be either male or female"),

    appointmentFee: z.number("Appointment fee must be a number").nonnegative("Appointment fee cannot be negative"),
    qualification: z.string("Qualification is required").min(2, "Qualification must be at least 2 characters").max(50, 
        "Qualification must be at most 50 characters"),

    currentWorkingPlace: z.string("Current working place is required").min(2, 
        "Current working place must be at least 2 characters").max(50, "Current working place must be at most 50 characters"),

    designation: z.string("Designation is required").min(2, "Designation must be at least 2 characters").max(50, 
        "Designation must be at most 50 characters"),



    }),
    specialties: z.array(z.uuid(), "Specialties must be an array of strings").min(1, "Include at least 1 specialty"),
})

const router = Router();

router.post("/create-doctor",
    
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
    
    UserController.createDoctor);


export const UserRoute = router;