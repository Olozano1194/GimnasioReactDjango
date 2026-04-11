import axios from 'axios';
import { getToken } from '../../utils/tokenStorage';

const baseURL = import.meta.env.MODE === 'development' 
              ? import.meta.env.VITE_API_URL_DEV
              : import.meta.env.VITE_API_URL_PROD;

// Cliente público (sin token) - para login/register
export const axiosPublic = axios.create({   
    baseURL,
});

// Cliente privado (con token) - para endpoints protegidos
export const axiosPrivate = axios.create({   
    baseURL,
});

// Agregar el token antes de cada request protegido
axiosPrivate.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});