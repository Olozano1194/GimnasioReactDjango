//Models
import { MemberDay } from '../../model/memberDay.model';
//DTO
import { CreateMemberDayDto } from '../../model/dto/memberDay.dto';
//axios
import { axiosPrivate } from '../axios.private';


export const createMemberDay = async (userGymDay: CreateMemberDayDto) => {
    const response = await axiosPrivate.post<MemberDay>('/UserGymDay/', userGymDay);
    return response.data;
};

//Lista de los miembros del gimnasio
export const getMembersDay = async (search = ''): Promise<MemberDay[]> => {
    const response = await axiosPrivate.get<MemberDay[]>(`/UserGymDay/`, {
            params: {
                search: search
            }
        });
    //console.log('API Response:', response.data);
    return response.data;
}

//Eliminar miembro del gimnasio
export const deleteMember = async (id: number): Promise<void> => {
    const response = await axiosPrivate.delete(`/UserGymDay/${id}/`);
    return response.data;
}

//Obtener miembro del gimnasio
export const getMember = async (id: number): Promise<MemberDay> => {
    const response = await axiosPrivate.get<MemberDay>(`/UserGymDay/${id}/`);
    return response.data;
}

//Actualizar miembro del gimnasio
export const updateMember = async (id: number, userGym: CreateMemberDayDto) => {
    const response = await axiosPrivate.put<MemberDay>(`/UserGymDay/${id}/`, userGym);
    return response.data;
}

export const getHome = async () => {
    const response = await axiosPrivate.get(`/home/`);
    return response.data;
};