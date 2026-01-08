import { Notification } from "../../model/notifications.model"
import { axiosPrivate } from "../axios.private";


export const getMemberNotifications = async (): Promise<Notification[]> => {
    // const token = localStorage.getItem('token');   
    const response = await axiosPrivate.get<Notification[]>('/membership-notifications/')
    return response.data;
    
}