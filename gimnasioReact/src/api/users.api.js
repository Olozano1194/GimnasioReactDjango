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
        const response = await gymApi.post('/User/', user, );
        const { token } = response.data;

        //Almacenamos el token en el localstorage para las futuras solicitudes
        //localStorage.setItem('token', token);
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

//Actualizar Usuario
export const updateUser = async (id, user) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    if (user.name) formData.append('name', user.name);
    if (user.lastname) formData.append('lastname', user.lastname);
    if (user.roles) formData.append('roles', user.roles);

    if (user.avatar) {
        formData.append('avatar', user.avatar);
    }

    // Debug - ver contenido del FormData
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
    

    try {
        const response = await gymApi.put(`/User/${id}/`, formData, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'multipart/form-data',
                },
            });
        return response.data;
        
    } catch (error) {
        console.error('Error logging in:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw error;      
        
    }
    
}