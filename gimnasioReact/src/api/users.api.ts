import axios, { AxiosResponse } from "axios";
import { axiosPublic } from "./axios.public";
//Models
import { User } from "../model/user.model";
//DTO
import {
  CreateUserDto,
  LoginUserDto,
  LoginResponse,
} from "../model/dto/user.dto";

export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("API Error:", errorMessage);
    throw new Error(errorMessage);
  }
  throw error;
};

// Creamos un usuario
export const CreateUsers = async (user: CreateUserDto) => {
  try {
    const response: AxiosResponse<{ token: string }> = await axiosPublic.post(
      "/User/",
      user,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const { token } = response.data;

    //Almacenamos el token en el localstorage para las futuras solicitudes
    //localStorage.setItem('token', token);
    return token;
  } catch (error) {
    throw handleApiError(error);
  }
};

//Inicio de sesión
export const login = async (
  credentials: LoginUserDto
): Promise<string> => {
    
  const { data } = await axiosPublic.post<LoginResponse>("/login/", credentials);
  return data.token;
};

//function profile
export const getUserProfile = async (): Promise<{ user: User }> => {
  const token = localStorage.getItem("token");

  try {
    const response = await axiosPublic.get(`/me/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    //console.log('User profile response:', response.data);

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

//Lista de usuarios
export const getUsers = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await axiosPublic.get<User[]>("/User/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    //console.log('Users response:', response.data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

//Actualizar Usuario
export const updateUser = async (
  id: number,
  user: CreateUserDto
): Promise<User> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  if (user.name) formData.append("name", user.name);
  if (user.lastname) formData.append("lastname", user.lastname);
  if (typeof user.roles === "string") formData.append("roles", user.roles);
  //if (user.email) formData.append('email', user.email);

  if (user.avatar) {
    formData.append("avatar", user.avatar);
  }

  try {
    const response = await axiosPublic.put<User>(`/User/${id}/`, formData, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
