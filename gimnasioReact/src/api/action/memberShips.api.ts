//Models
import { Membresia } from '../../model/memberShips.model';
//DTO
import { CreateMemberShipsDTO } from '../../model/dto/memberShips.dto';
//axios y errores
import { axiosPrivate } from '../axios.private';


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
    const response = await axiosPrivate.post<Membresia>('/MemberShips/', member);      
    return response.data;
};

//Lista de los miembros del gimnasio
export const getMemberList = async () => {
    const response = await axiosPrivate.get<Membresia[]>(`/MemberShips/`);
    //console.log('API Response:', response.data);        
    return response.data;
}

//Eliminar miembro del gimnasio
export const deleteMemberShips = async (id: number): Promise<void> => {
    const response = await axiosPrivate.delete(`/MemberShips/${id}/`);
    //console.log('API Response:', response.data);        
    return response.data;
}

//Obtener miembro del gimnasio
export const getMemberShips = async (id: number): Promise<Membresia> => {
    const response = await axiosPrivate.get<Membresia>(`/MemberShips/${id}/`);
    return response.data;
}

//Actualizar miembro del gimnasio
export const updateMemberShips = async (id: number, memberShips: CreateMemberShipsDTO ): Promise<Membresia> => {
    const response = await axiosPrivate.put<Membresia>(`/MemberShips/${id}/`, memberShips);
    return response.data; 
}

