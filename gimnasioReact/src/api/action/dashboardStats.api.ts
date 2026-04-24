//Models
export interface DashboardStats {
    active_members: number;
    new_today: number;
    retention_rate: number;
}

//axios
import { axiosPrivate } from '../axios/axios.private';

//Obtener estadísticas del dashboard
export const getDashboardStats = async (): Promise<DashboardStats> => {
    const response = await axiosPrivate.get<DashboardStats>('/dashboard-stats/');
    return response.data;
}