import axios, { AxiosResponse } from 'axios';
//Models
import { User } from '../model/user.model';
//DTO
import { CreateUserDto, LoginUserDto } from '../model/dto/user.dto';

export const gymApi = axios.create({
    //baseURL: 'http://localhost:8000/gym/api/v1/',
    baseURL: import.meta.env.MODE === 'development' 
    ? 'http://localhost:8000/gym/api/v1'
    : 'https://gimnasioreactdjango.onrender.com/gym/api/v1',
    headers: {
        'Content-Type': 'application/json',
      },

});

export const handleApiError = (error: unknown): never => {
    if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error('API Error:', errorMessage);
        throw new Error(errorMessage);
    }
    throw error;
};

// Creamos un usuario
export const CreateUsers = async (user: CreateUserDto) => {
    try {
        const response: AxiosResponse<{ token: string }>  = await gymApi.post('/User/', user, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        } );
        const { token } = response.data;

        //Almacenamos el token en el localstorage para las futuras solicitudes
        //localStorage.setItem('token', token);
        return token;
        
    } catch (error) {
        throw handleApiError(error);  
    }
  
};

//Inicio de sesión
export const login = async (credentials: LoginUserDto) => {
  try {
      const response = await gymApi.post('/login/', credentials);            
      return response.data;
      
  } catch (error) {      
      throw handleApiError(error);      
  }
  
}

//function profile
export const getUserProfile = async (): Promise<{user: User}> => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.get(`/me/`, {
            headers: {
                'Authorization': `Token ${token}`
                },
            }
        );
        //console.log('User profile response:', response.data);
        
        return response.data;
        
    } catch (error) {
        throw handleApiError(error);        
    }
};

//Lista de usuarios
export const getUsers = async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.get<User[]>('/User/', {
            headers: {
                'Authorization': `Token ${token}`
                },
            }
        );
        //console.log('Users response:', response.data);        
        return response.data;
        
    } catch (error) {
        throw handleApiError(error);        
    }
};

//Actualizar Usuario
export const updateUser = async (id: number, user: CreateUserDto): Promise<User> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    if (user.name) formData.append('name', user.name);
    if (user.lastname) formData.append('lastname', user.lastname);
    if (typeof user.roles === 'string') formData.append('roles', user.roles);
    //if (user.email) formData.append('email', user.email);

    if (user.avatar) {
        formData.append('avatar', user.avatar);
    }      

    try {
        const response = await gymApi.put<User>(`/User/${id}/`, formData, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
        
    } catch (error) {
        throw handleApiError(error);             
    }    
}