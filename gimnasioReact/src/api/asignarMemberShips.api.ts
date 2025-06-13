import axios from 'axios';
import { CreateAsignarMemberShipsDto } from '../model/dto/asignarMemberShips.dto';
import { AsignarMemberShips } from '../model/asignarMemberShips.model';

const gymApi = axios.create({
    //gitbaseURL: 'http://localhost:8000/gym/api/v1/',
    baseURL: import.meta.env.MODE === 'development' 
        ? 'http://localhost:8000/gym/api/v1'
        : 'https://gimnasioreactdjango.onrender.com/gym/api/v1',
    headers: {
        'Content-Type': 'application/json',
      },

});

// Función helper para manejar errores
const handleApiError = (error: unknown): never => {
    if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error('API Error:', errorMessage);
        throw new Error(errorMessage);
    }
    throw error;
};

//Creación de miembros del gimnasio
export const createAsignarMemberShips = async (member: CreateAsignarMemberShipsDto) => {
    const token = localStorage.getItem('token');
    try {
        const { data } = await gymApi.post<AsignarMemberShips>('/MemberShipsAsignada/', member, {
            headers: {
                'Authorization': `Token ${token}`
                },
            });      
        return data;
        
    } catch (error) {
        throw handleApiError(error);              
    }  
};

//Lista de los miembros del gimnasio
export const getAsignarMemberList = async () => {
    const token = localStorage.getItem('token');

    try {
        const { data } = await gymApi.get<AsignarMemberShips[]>(`/MemberShipsAsignada/`, {
            headers: {
                'Authorization': `Token ${token}`
                },
            });
        //console.log('API Response:', response.data);        
        return data;
        
    } catch (error) {
        throw handleApiError(error);        
    }
    
};

//Eliminar miembro del gimnasio
export const deleteAsignarMemberShips = async (id: number): Promise<void> => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.delete(`/MemberShipsAsignada/${id}/`, {
            headers: {
                'Authorization': `Token ${token}`
                },
            });
        //console.log('API Response:', response.data);        
        return response.data;
        
    } catch (error) {
        throw handleApiError(error);       
    }    
};

//Obtener una asignación de membresía especifica
export const getAsignarMemberShips = async (id: number): Promise<AsignarMemberShips> => {
    const token = localStorage.getItem('token');

    try {
        const { data } = await gymApi.get<AsignarMemberShips>(`/MemberShipsAsignada/${id}/`, {
            headers: {
                'Authorization': `Token ${token}`
                },
            });
        return data;
        
    } catch (error) {
        throw handleApiError(error);        
    }
    
};

//Actualizar miembro del gimnasio
export const updateAsignarMemberShips = async (id: number, memberShips: CreateAsignarMemberShipsDto): Promise<AsignarMemberShips> => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.put<AsignarMemberShips>(`/MemberShipsAsignada/${id}/`, memberShips, {
            headers: {
                'Authorization': `Token ${token}`
                },
            });
        return response.data;
        
    } catch (error) {
        throw handleApiError(error);        
    }    
};