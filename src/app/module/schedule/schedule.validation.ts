import z from "zod";

export const createScheduleZodSchema = z.object({
    startDate : z.string().refine((date) => !isNaN(Date.parse(date)), {
        message : "invalid start date format"
    }),
    
    endDate : z.string().refine((date) => !isNaN(Date.parse(date)), {
        message : "invalid end date format"
    }),

    startTime : z.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
        message : "invalid time format"
    }),
    endTime : z.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time),{
        message : "invalid time format"
    }),
});

export const updateScheduleZodSchema = z.object({
    startDate : z.string().refine((date) => !isNaN(Date.parse(date)), {
        message : "invalid start date format"
    }),
    
    endDate : z.string().refine((date) => !isNaN(Date.parse(date)), {
        message : "invalid end date format"
    }),

    startTime : z.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
        message : "invalid time format"
    }),
    endTime : z.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time),{
        message : "invalid time format"
    }),
})


export const ScheduleValidation = {
    createScheduleZodSchema,
    updateScheduleZodSchema
}