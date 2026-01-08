import axios from 'axios';
import { getToken } from '../utils/tokenStorage';

const baseURL = import.meta.env.MODE === 'development' 
              ? import.meta.env.VITE_API_URL_DEV
              : import.meta.env.VITE_API_URL_PROD;

export const axiosPrivate = axios.create({   
    baseURL,
});


// Agregar el token antes de cada request
axiosPrivate.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});