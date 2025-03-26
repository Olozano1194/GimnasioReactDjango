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
export const createMemberShips = async (member) => {
    const token = localStorage.getItem('token');
    try {
        const response = await gymApi.post('/MemberShips/', member, {
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
export const getMemberList = async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.get(`/MemberShips/`, {
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
export const deleteMemberShips = async (id) => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.delete(`/MemberShips/${id}/`, {
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
export const getMemberShips = async (id) => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.get(`/MemberShips/${id}/`, {
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
export const updateMemberShips = async (id, memberShips) => {
    const token = localStorage.getItem('token');

    try {
        const response = await gymApi.put(`/MemberShips/${id}/`, memberShips, {
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

