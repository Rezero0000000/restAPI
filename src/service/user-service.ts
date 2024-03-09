import { CreateUserRequest, UserResponse, toUserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { ResponseError } from "../error/response-error";
import { Validation } from "../validation/validation";
import { Prisma } from "../application/database";
import bcrypt from "bcrypt"

export class UserService {
    static async register (request: CreateUserRequest) :Promise<UserResponse> {

        // validation
        const registerRequest = Validation.validate(UserValidation.REGISTER,  request);

        // Check duplicate username with prisma
        const totalUserWithSameUsername = await Prisma.user.count({
            where: {
                username: registerRequest.username
            }
        })
        if (totalUserWithSameUsername != 0) {
            throw new ResponseError (400, "Username already exists")
        }

        // Hash password
        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        // Create user
        const user = await Prisma.user.create({
            data: registerRequest
        });

        // return UserResponse
        return toUserResponse(user);
    }
}