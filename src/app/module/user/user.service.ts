import status from "http-status";
import { Role, Specialty } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateDoctorPayload } from "./user.interface";
import { tokenUtils } from "../../utils/token";

const createDoctor = async(payload : ICreateDoctorPayload) =>{

    const specialties: Specialty[] = [];   // why it is? what is the purpose of this line?

    for(const specialtyId of payload.specialties){
        const specialty = await prisma.specialty.findUnique({
            where : {
                id : specialtyId
            }


        })

        if(!specialty){
           // throw new Error(`specialty with id ${specialtyId} not found`)
           throw new AppError(status.NOT_FOUND, `specialty with id ${specialtyId} not found`);
        }

        specialties.push(specialty)  //why am i pushing specialty first? what is the reason of doing that even i haven't created a doctor yet?
                                     // if random/wrong specialty pushed inside it?
    } 

    const userExists = await prisma.user.findUnique({
        where : {
            email : payload.doctor.email
        }
    })

    if(userExists){
      //  throw new Error(`User with this email ${payload.doctor.email} already exists`)
          throw new AppError(status.CONFLICT, `User with this email ${payload.doctor.email} already exists`);
    }

    //create a user first , then transaction with doctor
    
    const userData = await auth.api.signUpEmail({  //how many input does better auth signUpEmail can take?
        body : {  //does body a build it something that i must need to use?
            email : payload.doctor.email,   //could i use just email instead of payload.doctor.email if i destructure payload first?
            password : payload.password,
            role : Role.DOCTOR,             // why doesn't it from payload? 
            name : payload.doctor.name,
            needPasswordChange : true     //why it is true? 
        }
    })

    //transaction part always inside try-catch block

    try{

        const result = await prisma.$transaction(async (tx) => {

           const doctorData = await tx.doctor.create({
            data : {                       //does data is built in? is it same as like body for better auth and data for prisma?
                userId : userData.user.id,      // how do i know there is user inside userData? 
                ...payload.doctor              //what is this spread operator line doing? what is the purpose? if i don't use that spread, then how it would be?
            }
           })

           const doctorSpecialties = specialties.map((specialty) =>{   //what is this function doing? why? where does that specialties come from?
            return{                         //why am i returning these below data? to whom i am returning? what purpose?
               doctorId : doctorData.id,
               specialtyId : specialty.id    //what is these doctorId and specialtyId come from? is it random? what is 
            }
           })

           await tx.doctorSpecialty.createMany({   //what is createMany does?
            data : doctorSpecialties // why does doctorSpecialties creating alongside doctor? 
           })

           
           const doctor = await tx.doctor.findUnique({   //what is doctor doing? why it is finding unique for what reason?
            where : {
                id : doctorData.id,
            },
            select :{                         // what is selecting here? why it is?
                    id: true,
                    userId: true,
                    name: true,
                    email: true,                // what is true doing here? what is the use case of true?
                    profilePhoto: true,
                    contactNumber: true,
                    address: true,
                    registrationNumber: true,
                    experience: true,
                    gender: true,
                    appointmentFee: true,
                    qualification: true,
                    currentWorkingPlace: true,
                    designation: true,
                    createdAt: true,
                    updatedAt: true,
                    user : {             //then how does user is inside of select? then again select?
                        select : {       //using select from above, does it also select user model inside doctor?
                               id: true,
                               email: true,
                               name: true,
                               role: true,
                               status: true,
                               emailVerified: true,
                               image: true,
                               isDeleted: true,
                               deletedAt: true,
                               createdAt: true,
                               updatedAt: true,
                        }
                    },
                    specialties:{        // then what specialties coming from and selecting? //is specialties table name? where does that come from?
                        select : {
                            specialty : {   // then where does that specialty coming from?  Is that table?
                                select : {
                                    title : true,
                                    id : true       //is there any shortcut show all this data instead of true true such bullshit?
                                }
                            }
                        }
                    }
            }

           })

           return doctor;      //why it returning? to whom it is returning?

        })

        const accessToken = tokenUtils.getAccessToken({
            userId : userData.user.id,
            name : userData.user.name,
            email : userData.user.email,
            role : userData.user.role,
            status : userData.user.status,
            isDeleted : userData.user.isDeleted,
            emailVerified : userData.user.emailVerified
        })

        const refreshToken = tokenUtils.getRefreshToken({

            userId : userData.user.id,
            name : userData.user.name,
            email : userData.user.email,
            role : userData.user.role,
            status : userData.user.status,
            isDeleted : userData.user.isDeleted,
            emailVerified : userData.user.emailVerified

        })


     return {
        ...userData,
        accessToken,
        refreshToken,
        result

     } 
     
     // to whom this result is returning? it is going to controllers' result, where we are destructuring and setting up inside cookie

    }catch(error){
        console.log("Transaction error : ", error);
        
        await prisma.user.delete({   // will that hard delete user data or soft delete?
            where : {
                id : userData.user.id
            }
        })

        throw error;
    }



}







export const UserService = {
    createDoctor
}