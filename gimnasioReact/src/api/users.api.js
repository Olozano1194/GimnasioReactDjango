import axios from 'axios';


const gymApi = axios.create({
    baseURL: 'http://localhost:8000/gym/api/v1/',
    headers: {
        'Content-Type': 'application/json',
      },

});

// Creamos un usuario
export const CreateUsers = async (user) => {
  try {
      const response = await gymApi.post('/User/', user);
      const { token } = response.data;

      //Almacenamos el token en el localstorage para las futuras solicitudes
      localStorage.setItem('token', token);

      return response.data;
      
  } catch (error) {
      console.error('Error fetching users:', error.response ? error.response.data : error.message);
      throw error;
         
  }
  
};

//Inicio de sesión
export const login = async (email, password) => {
  try {
      const response = await gymApi.post('/login/', {
          email,
          password

      });
      console.log('API Response:', response.data);
      
      return response.data;
      
  } catch (error) {
      console.error('Error logging in:',error);
      throw error;      
      
  }
  
}