import status from "http-status"
import AppError from "../../errorHelpers/AppError"
import { IRequestUser } from "../../interfaces/requestUser.interface"
import { prisma } from "../../lib/prisma"
import { UserStatus } from "../../../generated/prisma/enums"

const softDeleteAdmin = async(id : string, user : IRequestUser) =>{

    const isAdminExist = await prisma.admin.findUnique({
        where : {
            id : id
        }
    })

    if(!isAdminExist){
        throw new AppError(status.NOT_FOUND, "admin not found with this email");
    }

    if(isAdminExist.id === user.userId){

        throw new AppError(status.BAD_REQUEST, "admins can't delete themselves")
    }


    const result = await prisma.$transaction(async (tx) =>{
        await tx.admin.update({
            where : {
                id : id
            },
            data : {
                isDeleted : true,
                deletedAt : new Date()
            }
        })


        await tx.user.update({
            where : { id : isAdminExist.userId},
            data : {
                isDeleted : true,
                deletedAt : new Date(),
                status : UserStatus.DELETED
            }
        })


        await tx.session.deleteMany({
            where : {userId : isAdminExist.userId}
        })

        await tx.account.deleteMany({
            where : {userId : isAdminExist.userId}
        })

    })


    return result;

}

export const AdminService = {
    softDeleteAdmin
}