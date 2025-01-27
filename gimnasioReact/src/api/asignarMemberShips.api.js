import axios from 'axios';

const gymApi = axios.create({
    //gitbaseURL: 'http://localhost:8000/gym/api/v1/',
    baseURL: import.meta.env.MODE === 'development' 
        ? 'http://localhost:8000/gym/api/v1'
        : 'https://gimnasioreactdjango.onrender.com/gym/api/v1',
    headers: {
        'Content-Type': 'application/json',
      },

});

//Creación de miembros del gimnasio
export const createAsignarMemberShips = async (member) => {
    const token = localStorage.getItem('token');
    try {
        const response = await gymApi.post('/MemberShipsAsignada/', member, {
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
export const getAsignarMemberList = async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.get(`/MemberShipsAsignada/`, {
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
export const deleteAsignarMemberShips = async (id) => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.delete(`/MemberShipsAsignada/${id}/`, {
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
export const getAsignarMemberShips = async (id) => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.get(`/MemberShipsAsignada/${id}/`, {
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
export const updateAsignarMemberShips = async (id, memberShips) => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.put(`/MemberShipsAsignada/${id}/`, memberShips, {
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