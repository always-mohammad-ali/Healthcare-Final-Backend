import { uuidv7 } from "zod";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { IBookAppointmentPayload } from "./appointment.interface";

const bookAppointment = async(payload : IBookAppointmentPayload, user : IRequestUser) =>{
   
    const patientData = await prisma.patient.findUniqueOrThrow({
         where : {
            email : user.email
         }
    })

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where : {
            email : user.email,
            isDeleted : false
        }
    })

    const scheduleData = await prisma.schedule.findUniqueOrThrow({
        where : {
            id : payload.scheduleId
        }
    })

    const doctorSchedule = await prisma.doctorSchedules.findUniqueOrThrow({
        where : {
            doctorId_scheduleId : {
                doctorId : doctorData.id,
                scheduleId : scheduleData.id
            }
        }
    })

    const videoCallingId = String(uuidv7());

    const result = await prisma.$transaction(async(tx) =>{
        const appointmentData = await tx.appointment.create({
            data : {
                doctorId : payload.doctorId,
                patientId : patientData.id,
                scheduleId : doctorSchedule.scheduleId,
                videoCallingId
            }
        })


        await tx.doctorSchedules.update({
            where : {
                doctorId_scheduleId : {
                    doctorId : payload.doctorId,
                    scheduleId : payload.scheduleId
                }
            },
            data : {
                isBooked : true,
            }
        })

        //TODO : Payment Integration will be here


    })

}




export const AppointmentService = {
    bookAppointment
}