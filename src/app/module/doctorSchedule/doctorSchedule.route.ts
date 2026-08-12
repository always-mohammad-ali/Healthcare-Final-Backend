import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";

const router = Router();

router.post("/create-my-doctor-schedule", DoctorScheduleController.createMyDoctorSchedule);

router.patch("/update-my-doctor-schedule", DoctorScheduleController.updateDoctorSchedule);

export const DoctorSchedules = router;