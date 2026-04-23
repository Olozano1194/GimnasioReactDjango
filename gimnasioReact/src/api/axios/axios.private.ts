import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getAccessToken, setAccessToken, clearAccessToken, clearRefreshCookie } from '../../utils/authStorage';
import { refreshAccessToken } from './refreshToken.api';

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
    withCredentials: true,  // Importante para enviar cookies
});

// Cola de requests pendientes mientras se hace refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Request interceptor: agregar access token
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: manejar 401 y auto-refresh
axiosPrivate.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si el error no es 401 o ya se intentó retry, rechazar
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Ya hay un refresh en progreso, agregar este request a la cola
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(axiosPrivate(originalRequest));
          },
          reject: (err: Error) => {
            reject(err);
          },
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Intentar refresh
      const newAccessToken = await refreshAccessToken();
      setAccessToken(newAccessToken);
      
      // Procesar cola de requests pendientes
      processQueue(null, newAccessToken);
      
      // Reintentar request original con nuevo token
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }
      return axiosPrivate(originalRequest);
    } catch (refreshError) {
      // Refresh falló, limpiar todo
      processQueue(refreshError as Error, null);
      
      // Limpiar tokens y cookies
      clearAccessToken();
      clearRefreshCookie();
      
      // Redirigir a login
      window.location.href = '/login';
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);