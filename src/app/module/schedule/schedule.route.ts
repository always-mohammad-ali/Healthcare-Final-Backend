import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { ScheduleValidation } from "./schedule.validation";

const router = Router();

router.post("/", validateRequest(ScheduleValidation.createScheduleZodSchema), ScheduleController.createSchedule);


export const ScheduleRoutes = router;