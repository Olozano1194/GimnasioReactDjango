//Models
import { Miembro } from '../../model/member.model';
//DTO
import { CreateMemberDto } from '../../model/dto/member.dto';
//axios y errores
import { axiosPrivate } from '../axios.private';


// Crear Miembros
export const createMember = async (userGym: CreateMemberDto) => {
    const response = await axiosPrivate.post<Miembro>('/UserGym/', userGym);      
    return response.data;
};

//Lista de los miembros del gimnasio
export const getMembers = async (search = ''): Promise<Miembro[]> => {
    const response = await axiosPrivate.get<Miembro[]>(`/UserGym/`, {
            params: {
                search: search
            }
    });
    //console.log('API Response:', response.data);        
    return response.data; 
}

//Eliminar miembro del gimnasio
export const deleteMember = async (id: number): Promise<void> => {
    const response = await axiosPrivate.delete(`/UserGym/${id}/`);
    //console.log('API Response:', response.data);
    return response.data;
}

//Obtener miembro del gimnasio
export const getMember = async (id: number): Promise<Miembro> => {
   const response = await axiosPrivate.get<Miembro>(`/UserGym/${id}/`);
    return response.data;
}

//Actualizar miembro del gimnasio
export const updateMember = async (id: number, userGym: CreateMemberDto): Promise<Miembro> => {
    const response = await axiosPrivate.put<Miembro>(`/UserGym/${id}/`, userGym);
    return response.data;
}