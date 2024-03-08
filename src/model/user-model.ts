
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