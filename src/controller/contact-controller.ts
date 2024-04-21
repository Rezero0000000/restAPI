import { Response, NextFunction } from "express";
import { CreateContactRequest, updateContactRequest } from "../model/contact-model";
import { ContactService } from "../service/contact-service";
import { UserRequest } from "../type/user-request";

export class ContactController {
    static async create (req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request :CreateContactRequest = req.body as CreateContactRequest;
            const response = await ContactService.create(req.user!, request);

            res.status(200).json({
                data: response
            });
        }
        catch (e) {
            next(e)
        }
    }

    static async get (req: UserRequest, res: Response, next: NextFunction) {
        try {
            const contactId = Number(req.params.contactId)
            const response = await ContactService.get(req.user!, contactId);
            res.status(200).json({
                data: response
            });
        }
        catch (e) {
            next(e)
        }
    }

    
    static async update (req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request :updateContactRequest = req.body as updateContactRequest;
            request.id = Number(req.params.contactId)
            const response = await ContactService.update(req.user!, request);
            res.status(200).json({
                data: response
            });
        }
        catch (e) {
            next(e)
        }
    }

    static async remove (req: UserRequest, res: Response, next: NextFunction) {
        try {
            const contactId = Number(req.params.contactId)
            const response = await ContactService.remove(req.user!, contactId);
            res.status(200).json({
                data: response
            });
        }
        catch (e) {
            next(e)
        }
    }
}