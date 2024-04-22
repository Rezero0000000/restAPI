import { Address, User } from "@prisma/client";
import { AddressResponse, CreateAddressRequest, GetAddressRequest, toAddressResponse, UpdateAddressRequest } from "../model/address-model";
import { ContactService } from "./contact-service";
import { Validation } from "../validation/validation";
import { AddressValidation } from "../validation/adress-validation";
import { Prisma } from "../application/database";
import { ResponseError } from "../error/response-error";

export class AddressService {
    static async create (user: User, request: CreateAddressRequest): Promise<AddressResponse> {
        const validateRequest = Validation.validate(AddressValidation.CREATE, request);
        await ContactService.checkContactMustExists(user, validateRequest.contact_id);

        const response = await Prisma.address.create({
            data: validateRequest
        });
        
        return toAddressResponse(response);
    }

    static async checkAddressMustExists (addressId: number, contactId: number) {
        const address = await Prisma.address.findFirst({
            where: {
                id: addressId,
                contact_id: contactId
            }
        });

        if (!address) {
            throw new ResponseError (404, "Data not found");
        }

        return address
    }

    static async get (user: User , request: GetAddressRequest): Promise<Address> {
        const validateRequest = await Validation.validate(AddressValidation.GET, request);
        await ContactService.checkContactMustExists(user, validateRequest.contact_id);
        const address = await this.checkAddressMustExists(validateRequest.id, validateRequest.contact_id);

        return address;
    }

    static async update(user: User, request: UpdateAddressRequest): Promise<AddressResponse> {
        const validateRequest = await Validation.validate(AddressValidation.UPDATE, request);
        await ContactService.checkContactMustExists(user, validateRequest.contact_id);
        await this.checkAddressMustExists(validateRequest.id, validateRequest.contact_id);

        const response = await Prisma.address.update({
            where: {
                id: validateRequest.id,
                contact_id: validateRequest.contact_id
            },
            data: validateRequest
        })

        return toAddressResponse(response);
    }

    static async delete (user: User, request: GetAddressRequest): Promise <AddressResponse> {
        const validateRequest = await Validation.validate(AddressValidation.REMOVE, request)
        await ContactService.checkContactMustExists(user, validateRequest.contact_id);
        await this.checkAddressMustExists(validateRequest.id, validateRequest.contact_id);

        const address = await Prisma.address.delete({
            where: {
                id: validateRequest.id,
            }
        });

        return toAddressResponse(address);
    }

    static async list (user: User , contactId: number): Promise<Array<AddressResponse>> {
        await ContactService.checkContactMustExists(user, contactId);

        const addresses = await Prisma.address.findMany({
            where: {
                contact_id: contactId
            }
        });

        if (!addresses) {
            throw new ResponseError (404, "Data not found");
        }

        return addresses.map((address) => toAddressResponse(address));
    }
}