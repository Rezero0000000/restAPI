import { CreateUserRequest, LoginUserRequest, UpdateUserRequest, UserResponse, toUserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { ResponseError } from "../error/response-error";
import { Validation } from "../validation/validation";
import { Prisma } from "../application/database";
import { User } from "@prisma/client";
import {v4 as uuid} from "uuid";
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


        // Hash password and create user
        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
        const user = await Prisma.user.create({
            data: registerRequest
        });

        return toUserResponse(user);
    }

    static async login (request: LoginUserRequest) :Promise<UserResponse> {
        const LoginUserRequest = Validation.validate(UserValidation.LOGIN,  request);

        // Check user and password
        let user = await Prisma.user.findUnique({
            where: {
                username: LoginUserRequest.username
            }
        });

        if (!user) {
            throw new ResponseError (401, "User not found");
        }

        const isPasswordValid = await bcrypt.compare(LoginUserRequest.password, user.password);
        if (!isPasswordValid) {
            throw new ResponseError (401, "Wrong password");
        }

        // update user login
        user = await Prisma.user.update({
            where: {
                username: user.username
            },
            data: {
                token: uuid()
            }
        })

        const response = toUserResponse(user);
        response.token = user.token!;
        return response;
    }

    static async get (user :User) :Promise<UserResponse> {
        return toUserResponse(user);
    }

    static async update (user :User, request: UpdateUserRequest) :Promise<UserResponse> {
        const UpdateUserRequest = Validation.validate(UserValidation.UPDATE, request);
        
        if (UpdateUserRequest.name) {
            user.name = UpdateUserRequest.name;
        }

        if (UpdateUserRequest.password) {
            user.password = await bcrypt.hash(UpdateUserRequest.password, 10);
        }

        const result = await Prisma.user.update({
            where: {
                username: user.username
            },
            data: user
        });

        return toUserResponse(result)
    }
}