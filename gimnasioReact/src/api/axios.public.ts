import axios from "axios";

const baseURL = import.meta.env.MODE === 'development' 
              ? import.meta.env.VITE_API_URL_DEV
              : import.meta.env.VITE_API_URL_PROD;

export const axiosPublic = axios.create({   
    baseURL, 
    headers: {
        'Content-Type': 'application/json',
      },
});