import { Role } from "../../generated/prisma/enums";
import { envVar } from "../config/env";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await prisma.user.findFirst({
            where:{
                role : Role.SUPERADMIN
            }
        })

        if(isSuperAdminExist) {
            console.log("Super admin already exists. Skipping seeding super admin.");
            return;
        }

        const superAdminUser = await auth.api.signUpEmail({
            body:{
                email : envVar.SUPER_ADMIN_EMAIL,
                password : envVar.SUPER_ADMIN_PASSWORD,
                name : "Super Admin",
                role : Role.SUPERADMIN,
                needPasswordChange : false,
                rememberMe : false,
            }
        })

        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where : {
                    id : superAdminUser.user.id
                },
                data : {
                    emailVerified : true,
                }
            });

            await tx.admin.create({
                data : {
                    userId : superAdminUser.user.id,
                    name : "Super Admin",
                    email : envVar.SUPER_ADMIN_EMAIL,
                }
            })

            
            
        });

        const superAdmin = await prisma.admin.findFirst({
            where : {
                email : envVar.SUPER_ADMIN_EMAIL,
            },
            include : {
                user : true,
            }
        })

        console.log("Super Admin Created ", superAdmin);
    } catch (error) {
        console.error("Error seeding super admin: ", error);
        await prisma.user.delete({
            where : {
                email : envVar.SUPER_ADMIN_EMAIL,
            }
        })
    }
}