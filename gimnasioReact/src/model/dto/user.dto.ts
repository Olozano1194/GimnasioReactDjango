export interface CreateUserDto {
    name: string;
    lastname: string;
    email?: string;
    roles?: string;
    password?: string;         
    avatar?: string | File;
    gimnasio?: number;  // FK a gimnasio
};


export interface LoginUserDto {
    email: string;
    password: string;    
};

export type LoginResponse = {
    token: string;
}

export type UserRole = 'admin' | 'recepcion';

export interface AuthUser {
    name: string;
    lastname: string;
    email?: string;
    avatar?: string;
    roles?: UserRole[];
    gimnasio_id?: number;
    gimnasio_name?: string;    
}