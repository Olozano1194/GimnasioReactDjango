import { axiosPrivate } from '../axios/axios.private';

export interface Activity {
    id: number;
    type: 'new_member' | 'entry' | 'payment' | 'warning';
    icon: string;
    color: 'primary' | 'info' | 'success' | 'warning';
    title: string;
    description: string;
    date: string;
    time_ago: string;
}

export const getActivities = async (): Promise<Activity[]> => {
    const response = await axiosPrivate.get<Activity[]>('/activities/');
    return response.data;
};
