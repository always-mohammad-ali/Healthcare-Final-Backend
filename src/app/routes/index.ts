import { Router } from "express";
import { SpecialtyRoutes } from "../module/specialty/specialty.route";
import { AuthRoute } from "../module/auth/auth.route";
import { UserRoute } from "../module/user/user.route";
import { DoctorRoute } from "../module/doctor/doctor.route";
import { AdminRoutes } from "../module/admin/admin.route";
import { ScheduleRoutes } from "../module/schedule/schedule.route";
import { DoctorSchedules } from "../module/doctorSchedule/doctorSchedule.route";
import { AppointmentRoutes } from "../module/appointment/appointment.route";

const router = Router();

router.use("/auth", AuthRoute);

router.use("/specialty", SpecialtyRoutes)

router.use("/user", UserRoute)

router.use("/doctors", DoctorRoute)

router.use("/admins", AdminRoutes);

router.use("/schedules", ScheduleRoutes);

router.use("/doctorSchedules", DoctorSchedules);

router.use("/appointments", AppointmentRoutes);




export const  IndexRoutes = router;