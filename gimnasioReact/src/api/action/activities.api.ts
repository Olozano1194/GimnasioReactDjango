import { axiosPrivate } from '../axios/axios.private';
import { Activity } from '../../model/dto/activity.dto';

export const getActivities = async (): Promise<Activity[]> => {
    const response = await axiosPrivate.get<Activity[]>('/activities/');
    return response.data;
};
