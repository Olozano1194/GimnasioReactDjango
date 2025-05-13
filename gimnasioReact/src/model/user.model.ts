export interface User {
    id: number;
    name: string;
    lastname: string;
    email: string;
    roles: string[];
    password: string;
    avatar?: string | File;
    repeatPass?: string;
};