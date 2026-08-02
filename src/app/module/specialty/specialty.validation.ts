import z from "zod";

const createSpecialtyZodSchema = z.object({
    title : z.string("title is required"),
    description : z.string("description is optional").optional()
})


export const SpecialtyValidation = {
    createSpecialtyZodSchema
}