import { Prisma } from "../src/application/database";
import { Address, Contact, User } from "@prisma/client";
import bcrypt from "bcrypt"

export class UserTest {
    static async delete () {
        await Prisma.user.deleteMany({
            where: {
                username: "rei"
            }
        })
    }

    static async create () {
        await Prisma.user.create({
            data: {
                name: "rei",
                username: "rei",
                password: await bcrypt.hash("rei", 10),
                token: "rei"
            }
        });
    }

    static async get ():    Promise<User> {
        const user = await Prisma.user.findFirst({
            where: {
                username: "rei"
            }
        })

        if (!user) {
            throw new Error("User not found");
        }
        return user
    }
};

export class ContactTest {
    static async deleteAll () {
        await Prisma.contact.deleteMany({
            where:{
                username: "rei"
            }
        })
    }

    static async create() {
        await Prisma.contact.create({
            data: {
                first_name: "test",
                last_name: "test",
                email: "test@example.com",
                phone: "08999999",
                username: "rei"
            }
        });
    }

    static async get(): Promise<Contact> {
        const contact = await Prisma.contact.findFirst({
            where: {
                username: "rei",
            }
        });

        if (!contact) {
            throw new Error("Contact is not found");
        }

        return contact;
    }
}


export class AddressTest {

    static async deleteAll() {
        await Prisma.address.deleteMany({
            where: {
                contact: {
                    username: "rei"
                }
            }
        })
    }
    static async create() {
        const contact = await ContactTest.get();
        await Prisma.address.create({
            data: {
                contact_id: contact.id,
                street: "Jalan test",
                city: "Kota test",
                province: "Provinsi test",
                country: "Indonesia",
                postal_code: "11111"
            }
        })
    }

    static async get(): Promise<Address> {
        const address = await Prisma.address.findFirst({
            where: {
                contact: {
                    username: "rei"
                }
            }
        });

        if (!address) {
            throw new Error("Address is not found")
        }

        return address;
    }
}