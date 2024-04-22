import { ContactResponse, CreateContactRequest, toContactResponse, updateContactRequest } from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { ResponseError } from "../error/response-error";
import { Validation } from "../validation/validation";
import { Prisma } from "../application/database";
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
        const contact = await this.checkContactMustExists(user, contactId);
        return contact;
    }

    static async checkContactMustExists (user: User, contactId: number): Promise<Contact> {
        const contact = await Prisma.contact.findFirst({
            where: {
                id: contactId,
                username: user.username
            }
        }); 
        
        if (!contact) {
            throw new ResponseError(404, "Contact not found");
        }
        return contact;
    }

    static async update (user: User, request: updateContactRequest): Promise<ContactResponse>{
        const validateRequest = await Validation.validate(ContactValidation.UPDATE, request);
        const contact = await this.checkContactMustExists(user, validateRequest.id);

        const response = await Prisma.contact.update({
            where: {
                id: validateRequest.id,
                username: contact.username
            },
            data: validateRequest
        });
        return toContactResponse(response);
    }

    static async remove (user: User, contactId: number): Promise<ContactResponse> {
        await this.checkContactMustExists(user, contactId);
        const contact = await Prisma.contact.delete({
            where: {
                id: contactId,
                username: user.username
            }
        })
        return toContactResponse(contact);
    }
}