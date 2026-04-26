import { useEffect, useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { login as loginApi } from '../api/users/authUser.api';
import { getAccessToken, setAccessToken, clearAccessToken, getRefreshTokenFromCookie, clearRefreshCookie } from '../utils/authStorage';
import { axiosPrivate } from '../api/axios/axios.private';
import type { LoginUserDto } from '../model/dto/user.dto';
import type { UserRole } from '../components/sideBar/components/SideBarMenus';
import { AuthUser } from '../model/dto/user.dto';
import { getUserProfile } from '../api/users/users.api';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      const refreshToken = getRefreshTokenFromCookie();
      
      if (!token && !refreshToken) {
        setLoading(false);
        return;        
      }
      
      if (!token && refreshToken) {
        setIsAuthenticated(true);
        await loadUser(); 
        return;
      }
      
      setIsAuthenticated(true);
      await loadUser(); 
    };
    initAuth();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getUserProfile();

      const avatarUrl = data.user.avatar instanceof File ? URL.createObjectURL(data.user.avatar) : data.user.avatar ?? '';

      let rolesArray: UserRole[] = [];

      if (data.user.roles) {
        const rawRoles = Array.isArray(data.user.roles) 
          ? data.user.roles 
          : [data.user.roles];
        
        rolesArray = rawRoles.filter((role): role is UserRole => 
          role === 'admin' || role === 'recepcion'
        );
      }
                
      setUser({
        name: data.user.name,
        lastname: data.user.lastname,
        email: data.user.email,
        avatar: avatarUrl,
        roles: rolesArray,
        gimnasio_id: data.user.gimnasio,
        gimnasio_name: data.user.gimnasio_name
      });      
      
    } catch {
      setError('Datos de usuarios no encontrados');
    } finally {
      setLoading(false);
    }
  };

  const performLogout = useCallback(async () => {
    const refreshToken = getRefreshTokenFromCookie();
    
    if (refreshToken) {
      try {
        await axiosPrivate.post('/token/blacklist/', { refresh: refreshToken });
      } catch {
        // Ignorar errores de blacklist, continuar con logout local
      }
    }
    
    clearAccessToken();
    clearRefreshCookie();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const login = async (credentials: LoginUserDto) => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = await loginApi(credentials);
      setAccessToken(accessToken);
      setIsAuthenticated(true);
      await loadUser();      
    } catch (error) {
      setError('Usuario o contraseña incorrectos');
      throw error;            
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    performLogout();
  };

  // Actualizar datos del usuario en el contexto (para reflejar cambios en el Header)
  const updateUserData = useCallback((data: Partial<AuthUser>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, error, login, logout, updateUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};