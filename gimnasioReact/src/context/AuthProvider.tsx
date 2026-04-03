import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { login as loginApi } from '../api/users/authUser.api';
import { getToken, setToken, removeToken } from '../utils/tokenStorage';
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
      const token = getToken();
      if (!token) {
        setLoading(false);
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
      const data  = await getUserProfile();

      const avatarUrl = data.user.avatar instanceof File ? URL.createObjectURL(data.user.avatar) : data.user.avatar ?? '';

      let rolesArray: UserRole[] = [];

      if (data.user.roles) {
        const rawRoles = Array.isArray(data.user.roles) 
          ? data.user.roles 
          : [data.user.roles];
        
        // Filtrar solo roles válidos
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
      setError('Datos de usuarios no encontrados')
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginUserDto) => {
    setLoading(true);
    setError(null);

    try {
      const token  = await loginApi(credentials);
      // console.log('loginApi response raw:', token);

      // if (!token) throw new Error("Token no encontrado");
      
      setToken(token);
      setIsAuthenticated(true);
      await loadUser();      
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
      value={{ user, isAuthenticated, loading, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

