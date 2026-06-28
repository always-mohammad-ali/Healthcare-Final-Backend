import { Router } from "express";
import { SpecialtyRoutes } from "../module/specialty/specialty.route";
import { AuthRoute } from "../module/auth/auth.route";
import { UserRoute } from "../module/user/user.route";

const router = Router();

router.use("/auth", AuthRoute);

router.use("/specialties", SpecialtyRoutes)

router.use("/user", UserRoute)



export const  IndexRoutes = router;