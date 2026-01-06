import axios from "axios";

export const axiosPublic = axios.create({
    //baseURL: 'http://localhost:8000/gym/api/v1/',
    baseURL: import.meta.env.MODE === 'development' 
    ? 'http://localhost:8000/gym/api/v1'
    : 'https://gimnasioreactdjango.onrender.com/gym/api/v1',
    headers: {
        'Content-Type': 'application/json',
      },
});