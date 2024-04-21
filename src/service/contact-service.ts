import { Prisma } from "../application/database";
import { ContactResponse, CreateContactRequest, toContactResponse } from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { Validation } from "../validation/validation";
import { User } from "@prisma/client";

export class ContactService {
    static async create (user: User, request: CreateContactRequest): Promise<ContactResponse>{
        const validateRequest = Validation.validate(ContactValidation.CREATE, request);
        const record = {
            ...validateRequest,
            ... {
                username: user.username
            }
        }

        const response = await Prisma.contact.create({
            data: record
        });

        console.log(response)
        return toContactResponse(response);
    }
}