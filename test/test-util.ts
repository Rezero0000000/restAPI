import { Prisma } from "../src/application/database";

export class UserTest {
    static async delete () {
        await Prisma.user.deleteMany({
            where: {
                username: "rei"
            }
        })
    }
};