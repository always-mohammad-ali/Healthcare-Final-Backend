import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { ICreateDoctorSchedulePayload, IUpdateDoctorSchedulePayload } from "./doctorSchedule.interface";

const createMyDoctorSchedule = async(payload : ICreateDoctorSchedulePayload, user : IRequestUser) =>{


    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where : {
            email : user.email
        }
    })

    const doctorScheduleData = payload.scheduleIds.map((scheduleId) =>({
        doctorId : doctorData.id,
        scheduleId
    })) 

    await prisma.doctorSchedules.createMany({
        data : doctorScheduleData
    })

    const result = await prisma.doctorSchedules.findMany({
        where : {
            doctorId : doctorData.id,
            scheduleId : {
                in : payload.scheduleIds
            }
        },
        include : {
            schedule : true
        }
    })

    return result;
}


const updateDoctorSchedule = async(payload : IUpdateDoctorSchedulePayload, user : IRequestUser) =>{

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where :{
            email : user.email
        } 
    });

    const deleteIds = payload.scheduleIds.filter((schedule) => schedule.shouldDelete).map((schedule) => schedule.id);
    const createIds = payload.scheduleIds.filter((schedule) => !schedule.shouldDelete).map((schedule) => schedule.id);


    const result = await prisma.$transaction(async (tx) =>{
        
        await tx.doctorSchedules.deleteMany({
            where : {
                isBooked : false,
                doctorId : doctorData.id,
                scheduleId : {
                    in : deleteIds
                }
            }
        })

        const doctorScheduleData = createIds.map((scheduleId) => ({
            doctorId : doctorData.id,
            scheduleId
        }))

       const result = await tx.doctorSchedules.createMany({
            data : doctorScheduleData
        })


        return result;
    })

    return result;


}

export const DoctorScheduleService = {
    createMyDoctorSchedule,
    updateDoctorSchedule
}

