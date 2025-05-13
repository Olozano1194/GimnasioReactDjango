export interface CreateUserDto {
    name: string;
    lastname: string;
    email?: string;
    roles: string[];
    password?: string;         
    avatar?: string | File;
};