//Models
import { Membresia } from '../../model/memberShips.model';
//DTO
import { CreateMemberShipsDTO } from '../../model/dto/memberShips.dto';
//axios
import { axiosPrivate } from '../axios.private';


//Creación de membresías
export const createMemberShips = async (member: CreateMemberShipsDTO) => {
    const response = await axiosPrivate.post<Membresia>('/MemberShips/', member);      
    return response.data;
};

//Lista de las membresías
export const getMemberList = async () => {
    const response = await axiosPrivate.get<Membresia[]>(`/MemberShips/`);
    //console.log('API Response:', response.data);        
    return response.data;
}

//Eliminar membresías
export const deleteMemberShips = async (id: number): Promise<void> => {
    const response = await axiosPrivate.delete(`/MemberShips/${id}/`);
    //console.log('API Response:', response.data);        
    return response.data;
}

//Obtener membresías
export const getMemberShips = async (id: number): Promise<Membresia> => {
    const response = await axiosPrivate.get<Membresia>(`/MemberShips/${id}/`);
    return response.data;
}

//Actualizar membresías
export const updateMemberShips = async (id: number, memberShips: CreateMemberShipsDTO ): Promise<Membresia> => {
    const response = await axiosPrivate.put<Membresia>(`/MemberShips/${id}/`, memberShips);
    return response.data; 
}

