import { User } from "@prisma/client"
export type UserResponse = {
    name :string
    username :string
    token? :string
}

export type CreateUserRequest = {
    name :string
    username :string
    password :string   
}

export type LoginUserRequest = {
    name: string,
    username: string
}

export function toUserResponse (user: User) :UserResponse {
    return {
        name: user.name,
        username: user.username,
    }
}