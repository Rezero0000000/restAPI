import { UserRequest } from "../type/user-request";
import { Prisma } from "../application/database";
import {Response, NextFunction } from "express";

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {

    const token = req.get("X-API-TOKEN");
    if (token){
        const user = await Prisma.user.findFirst({
            where: {
                token: token
            }
        });        
        if (user) {
            req.user = user;
            next();
            return;
        } 
    }
    res.status(401).json({
        errors: "Unauthorized"
    }).end();
    
}