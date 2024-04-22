import { User } from "@prisma/client";
import { AddressResponse, CreateAddressRequest, toAddressResponse } from "../model/address-model";
import { ContactService } from "./contact-service";
import { Validation } from "../validation/validation";
import { AddressValidation } from "../validation/adress-validation";
import { Prisma } from "../application/database";

export class AddressService {
    static async create (user: User, request: CreateAddressRequest): Promise<AddressResponse> {
        const validateRequest = Validation.validate(AddressValidation.CREATE, request);
        await ContactService.checkContactMustExists(user, validateRequest.contact_id);

        const response = await Prisma.address.create({
            data: validateRequest
        });
        
        return toAddressResponse(response);
    }
}