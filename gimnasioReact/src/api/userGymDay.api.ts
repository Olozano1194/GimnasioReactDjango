import axios from 'axios';
//Models
import { MemberDay } from '../model/memberDay.model';
//DTO
import { CreateMemberDayDto } from '../model/dto/memberDay.dto';


const gymApi = axios.create({
    //baseURL: 'http://localhost:8000/gym/api/v1/',
    baseURL: import.meta.env.MODE === 'development' 
        ? 'http://localhost:8000/gym/api/v1'
        : 'https://gimnasioreactdjango.onrender.com/gym/api/v1',
    headers: {
        'Content-Type': 'application/json',
      },

});

const handleApiError = (error: unknown): never => {
    if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error('API Error:', errorMessage);
        throw new Error(errorMessage);
    }
    throw error;
};

//Creación de miembros del gimnasio
export const createMemberDay = async (userGymDay: CreateMemberDayDto) => {
    const token = localStorage.getItem('token');
    try {
        const response = await gymApi.post<MemberDay>('/UserGymDay/', userGymDay, {
            headers: {
                'Authorization': `Token ${token}`
            },

        });
        return response.data;
        
    } catch (error) {
        throw handleApiError(error);                
    } 
};

//Lista de los miembros del gimnasio
export const getMembersDay = async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.get<MemberDay[]>(`/UserGymDay/`, {
            headers: {
                'Authorization': `Token ${token}`
                },
            });
        //console.log('API Response:', response.data);
        
        return response.data;
        
    } catch (error) {
        throw handleApiError(error);        
    }
    
}

//Eliminar miembro del gimnasio
export const deleteMember = async (id: number): Promise<void> => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.delete(`/UserGymDay/${id}/`, {
            headers: {
                'Authorization': `Token ${token}`
                },
            });
        //console.log('API Response:', response.data);
        
        return response.data;
        
    } catch (error) {
        throw handleApiError(error);        
    }    
}

//Obtener miembro del gimnasio
export const getMember = async (id: number): Promise<MemberDay> => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.get<MemberDay>(`/UserGymDay/${id}/`, {
            headers: {
                'Authorization': `Token ${token}`
                },
            });
        return response.data;
        
    } catch (error) {
        throw handleApiError(error);        
    }    
}

//Actualizar miembro del gimnasio
export const updateMember = async (id: number, userGym: CreateMemberDayDto) => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.put<MemberDay>(`/UserGymDay/${id}/`, userGym, {
            headers: {
                'Authorization': `Token ${token}`
                },
            });
        return response.data;
        
    } catch (error) {
        throw handleApiError(error);        
    }    
}

export const getHome = async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.get(`/home/`, {
            headers: {
                'Authorization': `Token ${token}`}
            });
        return response.data;
    } catch (error) {
        throw handleApiError(error);        
    }    
};