import { useEffect, useState } from "react";
//API
import { getUsers } from '../../../api/users.api';
//Enlaces
import { Link } from "react-router-dom";
// Table
import DataTable from 'react-data-table-component';
import 'styled-components';

const ListUser = () => {
    const [users, setUser] = useState([]);

    useEffect(() => {
        const axiosUserData = async () => {
            try {
                const data = await getUsers();
                console.log('User data received:', data);
                
                setUser([
                    ...data
                ]);
            }catch (error) {
                console.error(error);
            }
        };
        axiosUserData();
    }, []);

    const columns = [
        {
            name: '#',
            selector: (row, index) => index + 1,
                       
        },
        {
            name: 'Nombre',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Apellido',
            selector: row => row.lastname,
            sortable: true,
        },
        {
            name: 'Correo',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Roles',
            selector: row => row.roles,
            sortable: true,
        },
        {
            name: 'Acciones',
            selector: row => (<div className='flex gap-1'>
                <button className='bg-green-500 hover:bg-green-700 text-xs text-white font-bold py-2 px-4 rounded'>Editar</button>
                <button className='bg-red-500 hover:bg-red-700 text-xs text-white font-bold py-2 px-4 rounded'>Eliminar</button>
                </div>),
                button: true,                
        },
    ];

    const customStyles = {
        headCells: {
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            paddingLeft: '8px',
            paddingRight: '8px',
            backgroundColor: '#2b6cb0',
            color: 'white',
          },
        },
        cells: {
          style: {
            paddingLeft: '8px',
            paddingRight: '8px',
          },
        },
        rows: {
          highlightOnHoverStyle: {
            backgroundColor: 'rgb(230, 244, 244)',
            color: 'black',
            width: '100%',
          },
        },



    };

    return (
        <main className="cards bg-secondary w-full flex flex-col justify-center items-center gap-y-4 p-4 rounded-xl">
            <h1 className='text-xl font-bold pb-4' >Listado de Usuarios</h1>           
            <DataTable
                columns={columns}
                data={users}
                pagination
                highlightOnHover
                customStyles={customStyles} 
            />
        </main>
    );

}
export default ListUser;