import { Router } from "express";
import { AdminController } from "./admin.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";



const router = Router();

router.delete("/:id", checkAuth(Role.SUPERADMIN, Role.ADMIN), AdminController.softDeleteAdmin);



export const AdminRoutes = router;