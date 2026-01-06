import { createContext } from "react";


export interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (credentials: {
        email: string;
        password: string;
    }) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);