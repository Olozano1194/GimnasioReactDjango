import axios from 'axios';


const gymApi = axios.create({
    baseURL: 'http://localhost:8000/gym/api/v1/',
    headers: {
        'Content-Type': 'application/json',
      },

});

//Creación de miembros del gimnasio
export const createMember = async (userGym) => {
  try {
      const response = await gymApi.post('/UserGym/', userGym);
      const { token } = response.data;

      //Almacenamos el token en el localstorage para las futuras solicitudes
      localStorage.setItem('token', token);

      return response.data;
      
  } catch (error) {
      console.error('Error fetching users:', error.response ? error.response.data : error.message);
      throw error;
          
  }
  
};

//Lista de los miembros del gimnasio
export const getMembers = async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.get(`/UserGym/`, {
            headers: {
                'Authorization': `Token ${token}`
                },
            });
        //console.log('API Response:', response.data);
        
        return response.data;
        
    } catch (error) {
        console.error('Error logging in:',error);
        throw error;      
        
    }
    
}