import { addHours, addMinutes, format } from "date-fns";
import { ICreateSchedulePayload } from "./schedule.interface";
import { convertDateTime } from "./schedule.utils";
import { prisma } from "../../lib/prisma";

const createSchedule = async(payload : ICreateSchedulePayload) =>{

    const {startDate, endDate, startTime, endTime} = payload;

    const interval = 30;

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    const schedules = [];

    while(currentDate <= lastDate){

        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(startTime.split(":")[0])
                ),
                Number(startTime.split(":")[1])
            )
        );

        const endDateTime = new Date(

            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(endTime.split(":")[0])
                ),
                Number(endTime.split(":")[1])
            )
        );

        while(startDateTime < endDateTime){
            const s = await convertDateTime(startDateTime);
            const e = await convertDateTime(addMinutes(startDateTime, interval));

            const scheduleDate = {
                startDateTime : s,
                endDateTime : e
            }

            const existingSchedule = await prisma.schedule.findFirst({
                where : {
                    startDateTime : scheduleDate.startDateTime,
                    endDateTime : scheduleDate.endDateTime
                }
            })

            if(!existingSchedule){
                const result = await prisma.schedule.create({
                    data : scheduleDate
                })

                console.log(result);
                schedules.push(result);
            }

            startDateTime.setMinutes(startDateTime.getMinutes() + interval);
        }

        currentDate.setDate(currentDate.getDate() + 1);

    }



    return schedules;
}









export const ScheduleService = {
    createSchedule
}