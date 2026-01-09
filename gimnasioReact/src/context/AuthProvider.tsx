import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { login as loginApi } from '../api/authUser.api';
import { getToken, setToken, removeToken } from '../utils/tokenStorage';
import type { LoginUserDto } from '../model/dto/user.dto';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginUserDto) => {
    setLoading(true);
    setError(null);

    try {
      const token  = await loginApi(credentials);
      // console.log('loginApi response raw:', token);

      // if (!token) throw new Error("Token no encontrado");
      
      setToken(token);
      setIsAuthenticated(true);      
    } catch {
      setError('Usuario o contraseña incorrectos');            
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

