import { Router } from "express";
import { SpecialtyRoutes } from "../module/specialty/specialty.route";
import { AuthRoute } from "../module/auth/auth.route";
import { UserRoute } from "../module/user/user.route";
import { DoctorRoute } from "../module/doctor/doctor.route";
import { AdminRoutes } from "../module/admin/admin.route";

const router = Router();

router.use("/auth", AuthRoute);

router.use("/specialty", SpecialtyRoutes)

router.use("/user", UserRoute)

router.use("/doctors", DoctorRoute)

router.use("/admins", AdminRoutes);




export const  IndexRoutes = router;