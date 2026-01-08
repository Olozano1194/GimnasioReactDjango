import { axiosPublic } from "./axios.public";
//DTO
import {
  LoginUserDto,
  LoginResponse,
} from "../model/dto/user.dto";

//Inicio de sesión
export const login = async (
  credentials: LoginUserDto
): Promise<string> => {
    
  const { data } = await axiosPublic.post<LoginResponse>("/login/", credentials);
  return data.token;
};
