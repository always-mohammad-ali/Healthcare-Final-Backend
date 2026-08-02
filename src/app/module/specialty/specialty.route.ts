import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";
import { SpecialtyValidation } from "./specialty.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

router.post("/", multerUpload.single("file"), validateRequest(SpecialtyValidation.createSpecialtyZodSchema),  SpecialtyController.createSpecialty);
router.get("/", checkAuth(Role.ADMIN), SpecialtyController.getAllSpecialty);
router.put("/:id", checkAuth(Role.SUPERADMIN, Role.ADMIN, Role.DOCTOR), SpecialtyController.updateSpecialty);
router.delete("/:id", checkAuth(Role.SUPERADMIN, Role.ADMIN, Role.DOCTOR), SpecialtyController.deleteSpecialty);

export const SpecialtyRoutes = router;