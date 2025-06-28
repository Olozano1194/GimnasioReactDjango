//Models
import { Miembro } from '../model/member.model';
//DTO
import { CreateMemberDto } from '../model/dto/member.dto';
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

// export const handleApiError = (error: unknown): never => {
//     if (axios.isAxiosError(error)) {
//         const errorMessage = error.response?.data?.message || error.message;
//         console.error('API Error:', errorMessage);
//         throw new Error(errorMessage);
//     }
//     throw error;
// };

//Creación de miembros del gimnasio

export const createMember = async (userGym: CreateMemberDto) => {
    const token = localStorage.getItem('token');
    try {
        const response = await gymApi.post<Miembro>('/UserGym/', userGym, {
            headers: {
                'Authorization': `Token ${token}`
                },
            });      
        return response.data;
        
    } catch (error: unknown) {  
        throw handleApiError(error);                    
    } 
};

//Lista de los miembros del gimnasio
export const getMembers = async (search = ''): Promise<Miembro[]> => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.get<Miembro[]>(`/UserGym/`, {
            headers: {
                'Authorization': `Token ${token}`
            },
            params: {
                search: search
            }
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
        const response = await gymApi.delete(`/UserGym/${id}/`, {
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
export const getMember = async (id: number): Promise<Miembro> => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.get<Miembro>(`/UserGym/${id}/`, {
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
export const updateMember = async (id: number, userGym: CreateMemberDto): Promise<Miembro> => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.put<Miembro>(`/UserGym/${id}/`, userGym, {
            headers: {
                'Authorization': `Token ${token}`
                },
            });
        return response.data;
        
    } catch (error) {
        throw handleApiError(error);       
    }    
}