import { AxiosResponse } from "axios";
import { axiosPrivate } from "../axios.private";
//Models
import { User } from "../../model/user.model";
//DTO
import { CreateUserDto } from "../../model/dto/user.dto";

// Creamos un usuario
export const CreateUsers = async (user: CreateUserDto) => {
  const response: AxiosResponse<{ token: string }> = await axiosPrivate.post("/User/", user);
  const { token } = response.data;   
  return token;
};

//function profile
export const getUserProfile = async (): Promise<{ user: User }> => {
 const response = await axiosPrivate.get(`/me/`);
  return response.data;
};

//Lista de usuarios
export const getUsers = async () => {
  const response = await axiosPrivate.get<User[]>("/User/");
  return response.data; 
};

//Actualizar Usuario
export const updateUser = async (
  id: number,
  user: CreateUserDto
) => {
  const formData = new FormData();

  if (user.name) formData.append("name", user.name);
  if (user.lastname) formData.append("lastname", user.lastname);
  if (typeof user.roles === "string") formData.append("roles", user.roles);
  //if (user.email) formData.append('email', user.email);

  if (user.avatar) {
    formData.append("avatar", user.avatar);
  }

  const response = await axiosPrivate.put<User>(`/User/${id}/`, formData);
  return response.data;
};
