import { Prisma } from "../application/database";
import { ResponseError } from "../error/response-error";
import { ContactResponse, CreateContactRequest, toContactResponse } from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { Validation } from "../validation/validation";
import { Contact, User } from "@prisma/client";

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

        return toContactResponse(response);
    }

    static async get (user: User, contactId: number): Promise<Contact>{
        const contact = await Prisma.contact.findFirst({
            where: {
                id: contactId,
                username: user.username
            }
        });

        console.log(contact, "ssssss")

        if (!contact) {
            throw new ResponseError(400, "Contact not found");
        }
        return contact;
    }
}