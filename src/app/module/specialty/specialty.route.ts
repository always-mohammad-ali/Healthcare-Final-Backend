import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", checkAuth(Role.SUPERADMIN, Role.ADMIN, Role.DOCTOR) , SpecialtyController.createSpecialty);
router.get("/",checkAuth(Role.ADMIN), SpecialtyController.getAllSpecialty);
router.put("/:id", checkAuth(Role.SUPERADMIN, Role.ADMIN, Role.DOCTOR) , SpecialtyController.updateSpecialty);
router.delete("/:id", checkAuth(Role.SUPERADMIN, Role.ADMIN, Role.DOCTOR) , SpecialtyController.deleteSpecialty);

export const SpecialtyRoutes = router;