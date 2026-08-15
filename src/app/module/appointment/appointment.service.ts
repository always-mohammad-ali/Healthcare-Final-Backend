//import { uuidv7 } from "zod";
import {v7 as uuidv7} from "uuid"
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { IBookAppointmentPayload } from "./appointment.interface";
import { stripe } from "../../config/stripe.config";
import { envVar } from "../../config/env";
import { AppointmentStatus, PaymentStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

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
         
        const transactionId = String(uuidv7());

        const paymentData = await tx.payment.create({
            data : {
                appointmentId : appointmentData.id,
                amount : doctorData.appointmentFee,
                transactionId
            }
        })


        const session = await stripe.checkout.sessions.create({
            payment_method_types : ['card'],
            mode : 'payment',
            line_items :[
                {
                    price_data:{
                        currency : "bdt",
                        product_data : {
                            name : `Appointment with DR. ${doctorData.name}`
                        },
                        unit_amount : doctorData.appointmentFee * 100,
                    },
                    quantity : 1,
                }
            ],

            metadata: {

                appointmentId : appointmentData.id,
                paymentId : paymentData.id
            },

            success_url : `${envVar.FRONTEND_URL}/dashboard/payment/payment-success`,
            cancel_url : `${envVar.FRONTEND_URL}/dashboard/appointments`

        })

        return {
            appointmentData,
            paymentData,
            paymentUrl : session.url
        }

    });

    return{
        appointment : result.appointmentData,
        payment : result.paymentData,
        paymentUrl : result.paymentUrl
    }

}


const bookAppointmentWithPaylater = async(payload : IBookAppointmentPayload, user : IRequestUser) =>{
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

        return appointmentData
    })

    return {
        appointment : result
    }

}


const initiatePayment = async(appointmentId : string, user : IRequestUser) =>{
    const patientData = await prisma.patient.findUniqueOrThrow({
        where : {
            email : user.email
        }
    })


    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where : {
            id : appointmentId,
            patientId : patientData.id
        },
        include : {
            doctor : true,
            payment : true
        }
    })

    if(!appointmentData){
        throw new AppError(status.NOT_FOUND, "appointment data not found");
    }

    if(!appointmentData.payment){
        throw new AppError(status.NOT_FOUND, "payment data not found");
    }

    if(appointmentData.payment?.status === PaymentStatus.PAID){
        throw new AppError(status.BAD_REQUEST, "payment already paid")
    }

    if(appointmentData.status === AppointmentStatus.CANCELED){
        throw new AppError(status.BAD_REQUEST, "appointment canceled");
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types : ["card"],
        mode : "payment",
        line_items : [

            {

                price_data : {
                    currency : "bdt",
                    product_data : {
                        name : `Appointment with Dr. ${appointmentData.doctor.name}`
                    },
                    unit_amount : appointmentData.doctor.appointmentFee * 100,
                },
                quantity : 1
            
            }
        ],

        metadata : {
            appointmentId : appointmentData.id,
            paymentId : appointmentData.payment.id
        },

        success_url: `${envVar.FRONTEND_URL}/dashboard/payment/payment-success?appointment_id=${appointmentData.id}&payment_id=${appointmentData.payment.id}`,

        // cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
        cancel_url: `${envVar.FRONTEND_URL}/dashboard/appointments?error=payment_cancelled`,
    })

    return {
        paymentUrl : session.url
    }

}


const cancelUnpaidAppointments = async() =>{

    const thirtyMinutesAgo = new Date(Date.now() - 30*60*1000);

    const unpaidAppointments = await prisma.appointment.findMany({
        where : {
            createdAt : {
                lte : thirtyMinutesAgo
            },
            paymentStatus : PaymentStatus.UNPAID
        }
    })

    const appointmentToCancel = unpaidAppointments.map((appointment) => appointment.id);

    await prisma.$transaction(async (tx)=>{

        await tx.appointment.updateMany({
            where : {
                id : {
                    in : appointmentToCancel
                }
            },
            data :{
                status : AppointmentStatus.CANCELED
            }
        })


        await tx.payment.deleteMany({
            where : {
                appointmentId : {
                    in : appointmentToCancel
                }
            }
        })

        for(const unpaidAppointment of unpaidAppointments){
            await tx.doctorSchedules.update({
                where : {
                    doctorId_scheduleId : {
                        doctorId : unpaidAppointment.doctorId,
                        scheduleId : unpaidAppointment.scheduleId
                    }
                },
                data : {
                    isBooked : false,
                }
            })
        }
    })
}


export const AppointmentService = {
    bookAppointment,
    bookAppointmentWithPaylater,
    initiatePayment,
    cancelUnpaidAppointments,
}