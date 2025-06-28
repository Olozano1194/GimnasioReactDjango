//Models
import { Membresia } from '../model/memberShips.model';
//DTO
import { CreateMemberShipsDTO } from '../model/dto/memberShips.dto';
//axios y errores
import { gymApi } from './users.api';
import { handleApiError } from './users.api';

// const gymApi = axios.create({
//     //gitbaseURL: 'http://localhost:8000/gym/api/v1/',
//     baseURL: import.meta.env.MODE === 'development' 
//         ? 'http://localhost:8000/gym/api/v1'
//         : 'https://gimnasioreactdjango.onrender.com/gym/api/v1',
//     headers: {
//         'Content-Type': 'application/json',
//       },

// });

// const handleApiError = (error: unknown): never => {
//     if (axios.isAxiosError(error)) {
//         const errorMessage = error.response?.data?.message || error.message;
//         console.error('API Error:', errorMessage);
//         throw new Error(errorMessage);
//     }
//     throw error;
// };

//Creación de miembros del gimnasio

export const createMemberShips = async (member: CreateMemberShipsDTO) => {
    const token = localStorage.getItem('token');
    try {
        const response = await gymApi.post<Membresia>('/MemberShips/', member, {
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
export const getMemberList = async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.get<Membresia[]>(`/MemberShips/`, {
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
export const deleteMemberShips = async (id: number): Promise<void> => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.delete(`/MemberShips/${id}/`, {
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
export const getMemberShips = async (id: number): Promise<Membresia> => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.get<Membresia>(`/MemberShips/${id}/`, {
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
export const updateMemberShips = async (id: number, memberShips: CreateMemberShipsDTO ): Promise<Membresia> => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.put<Membresia>(`/MemberShips/${id}/`, memberShips, {
            headers: {
                'Authorization': `Token ${token}`
                },
            });
        return response.data;
        
    } catch (error) {
        throw handleApiError(error);        
    }   
}

