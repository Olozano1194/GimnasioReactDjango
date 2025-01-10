import axios from 'axios';

const gymApi = axios.create({
    baseURL: 'http://localhost:8000/gym/api/v1/',
    //baseURL: 'https://gimnasioreactdjango.onrender.com/gym/api/v1/',
    headers: {
        'Content-Type': 'application/json',
      },

});

//Creación de miembros del gimnasio
export const createMember = async (userGym) => {
    const token = localStorage.getItem('token');
    try {
        const response = await gymApi.post('/UserGym/', userGym, {
            headers: {
                'Authorization': `Token ${token}`
                },
            });      
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

//Eliminar miembro del gimnasio
export const deleteMember = async (id) => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.delete(`/UserGym/${id}/`, {
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

//Obtener miembro del gimnasio
export const getMember = async (id) => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.get(`/UserGym/${id}/`, {
            headers: {
                'Authorization': `Token ${token}`
                },
            });
        return response.data;
        
    } catch (error) {
        console.error('Error logging in:',error);
        throw error;      
        
    }
    
}

//Actualizar miembro del gimnasio
export const updateMember = async (id, userGym) => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.put(`/UserGym/${id}/`, userGym, {
            headers: {
                'Authorization': `Token ${token}`
                },
            });
        return response.data;
        
    } catch (error) {
        console.error('Error logging in:',error);
        throw error;      
        
    }
    
}