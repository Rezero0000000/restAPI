import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";

export const ErrorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
        if (error instanceof ZodError) {
            return res.status(400).json({
                errors: `validation error : ${JSON.stringify(error.message)}`
            })
        }
        else if (error instanceof ResponseError) {
            return res.status(error.status).json({
                errors: error.message
            })
        }
        else {
            return res.status(500). json({
                errors: error.message
            })
        }
}