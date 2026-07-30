import { Gender } from "../../../generated/prisma/enums";

export interface ICreateDoctorPayload{
    password : string;   //why does password is outside of doctor? what is the purpose and use case of password here?
    doctor : {
      name : string;
      email : string;
      profilePhoto ?: string;
      contactNumber ?: string;
      address?: string;
      registrationNumber: string;
      experience?: number;
      gender: Gender;
      appointmentFee: number;
      qualification: string;
      currentWorkingPlace: string;
      designation: string;
    },
    specialties : string[];  //why does specialties is outside of doctor? does specialties random name here or is it a field/column inside doctor table?
}