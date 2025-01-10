import axios from 'axios';

const gymApi = axios.create({
    //baseURL: 'http://localhost:8000/gym/api/v1/',
    baseURL: import.meta.env.MODE === 'development' 
    ? 'http://localhost:8000/gym/api/v1'
    : 'https://gimnasioreactdjango.onrender.com/gym/api/v1',
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
      return response.data;
      
  } catch (error) {
      console.error('Error logging in:',error);
      throw error;      
  }
  
}

//function profile
export const getUserProfile = async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.get(`/me/`, {
            headers: {
                'Authorization': `Token ${token}`
                },
            }
        );
        //console.log('User profile response:', response.data);
        
        return response.data;
        
    } catch (error) {
        console.error('Error fetching profile:',error);
        throw error;
        
    }
};

//Lista de usuarios
export const getUsers = async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.get('/User/', {
            headers: {
                'Authorization': `Token ${token}`
                },
            }
        );
        //console.log('Users response:', response.data);
        
        return response.data;
        
    } catch (error) {
        console.error('Error fetching users:',error);
        throw error;
        
    }
};