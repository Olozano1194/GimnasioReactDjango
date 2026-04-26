import { Notification } from "../../model/notifications.model"
import { axiosPrivate } from "../axios/axios.private";


export const getMemberNotifications = async (): Promise<Notification[]> => {
    const response = await axiosPrivate.get<Notification[]>('/membership-notifications/')
    return response.data;
}

export const markNotificationsAsRead = async (): Promise<{ status: string }> => {
    const response = await axiosPrivate.post<{ status: string }>('/membership-notifications/read/')
    return response.data;
}