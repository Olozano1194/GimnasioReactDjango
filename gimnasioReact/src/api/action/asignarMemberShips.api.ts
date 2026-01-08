//import axios from 'axios';
import { CreateAsignarMemberShipsDto } from '../../model/dto/asignarMemberShips.dto';
import { AsignarMemberShips } from '../../model/asignarMemberShips.model';
//axios y errores
import { axiosPrivate } from '../axios.private';



//Creación de miembros del gimnasio
export const createAsignarMemberShips = async (member: CreateAsignarMemberShipsDto) => {    
    const { data } = await axiosPrivate.post<AsignarMemberShips>('/MemberShipsAsignada/', member);      
    return data;
};

//Lista de los miembros del gimnasio
export const getAsignarMemberList = async (search = ''): Promise<AsignarMemberShips[]> => {
    const { data } = await axiosPrivate.get<AsignarMemberShips[]>(`/MemberShipsAsignada/`, {
            params: {
                search: search
            }
        });
        //console.log('API Response:', response.data);        
        return data;
};

//Eliminar miembro del gimnasio
export const deleteAsignarMemberShips = async (id: number): Promise<void> => {
    const response = await axiosPrivate.delete(`/MemberShipsAsignada/${id}/`);
        //console.log('API Response:', response.data);        
        return response.data;
};

//Obtener una asignación de membresía especifica
export const getAsignarMemberShips = async (id: number): Promise<AsignarMemberShips> => {
    const { data } = await axiosPrivate.get<AsignarMemberShips>(`/MemberShipsAsignada/${id}/`);
    return data;
};

//Actualizar miembro del gimnasio
export const updateAsignarMemberShips = async (id: number, memberShips: CreateAsignarMemberShipsDto): Promise<AsignarMemberShips> => {
    const response = await axiosPrivate.put<AsignarMemberShips>(`/MemberShipsAsignada/${id}/`, memberShips);
    return response.data;
};