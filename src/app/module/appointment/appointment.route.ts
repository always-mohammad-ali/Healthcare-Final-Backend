import { Router } from "express";
import { AppointmentController } from "./appointment.controller";

const router = Router();

router.post("/book-appointment", AppointmentController.bookAppointment);

router.post("/book-appointment-with-pay-later",  AppointmentController.bookAppointmentWithPaylater);
router.post("/initiate-payment/:id", AppointmentController.initiatePayment);

export const AppointmentRoutes = router;