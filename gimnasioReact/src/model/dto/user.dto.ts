export interface CreateUserDto {
    name: string;
    lastname: string;
    email?: string;
    roles: string[];
    password?: string;         
    avatar?: string | File;
};


export interface LoginUserDto {
    email: string;
    password: string;    
}