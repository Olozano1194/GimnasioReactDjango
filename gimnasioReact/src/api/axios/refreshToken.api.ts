import { axiosPublic } from '../axios/axios.public';  

export const refreshAccessToken = async (): Promise<string> => {
  const { data } = await axiosPublic.post('/token/refresh/');
  return data.access;
};