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
    username: string
    password: string
}

export type UpdateUserRequest = {
    name?: string
    password?: string
}

export function toUserResponse (user: User) :UserResponse {
    return {
        name: user.name,
        username: user.username,
    }
}