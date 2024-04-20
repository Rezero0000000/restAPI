import { Prisma } from "../src/application/database";
import { User } from "@prisma/client";
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

    // static async getCurrentUser () {

    // }
};