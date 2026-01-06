import { Notification } from "../model/notifications.model"
import { axiosPublic } from "./axios.public";
import { handleApiError } from "./users.api";


export const getMemberNotifications = async (): Promise<Notification[]> => {
    const token = localStorage.getItem('token');

    try {
        const response = await axiosPublic.get<Notification[]>('/membership-notifications/', {
            headers: {
                'Authorization': `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw handleApiError(error);       
    }
}