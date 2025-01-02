import { useEffect, useState } from "react";
//API
import { getUsers } from '../../../api/users.api';

import { createColumnHelper } from '@tanstack/react-table';
//Enlaces
import { Link } from "react-router-dom";

//Componente principal para la listas
import Table from '../../../component/Table';


const ListUser = () => {
    const [users, setUser] = useState([]);

    useEffect(() => {
        const axiosUserData = async () => {
            try {
                const data = await getUsers();
                //console.log('User data received:', data);
                
                setUser(data);
            }catch (error) {
                console.error(error);
            }
        };
        axiosUserData();
    }, []);

    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor('index', {
            header: 'N°',
            cell: ((info) => info.row.index + 1),
        }),
        columnHelper.accessor('name', {
            header: 'Nombre',

        }),
        columnHelper.accessor('lastname', {
            header: 'Apellido',
        }),
        columnHelper.accessor('email', {
            header: 'Correo',
        }),
        columnHelper.accessor('roles', {
            header: 'Rol',
        }),
        // columnHelper.accessor('actions', {
        //     header: 'Acciones',
        //     cell: (({ row }) => (
        //         <div className="flex justify-center items-center gap-x-4">
        //             <Link to={`/edit/usuarios/${row.original.id}`} className="bg-green-500 text-white p-2 rounded-md">Editar</Link>
        //             <button className="bg-red-500 text-white p-2 rounded-md">Eliminar</button>
        //         </div>
        //     )),
        // }),
    ];

    return (
        <main className="cards bg-secondary w-full flex flex-col justify-center items-center gap-y-4 p-4 rounded-xl">
            <h1 className='text-xl font-bold pb-4' >Listado de Usuarios</h1>
            <Table data={users} columns={columns} />         
        </main>
    );

}
export default ListUser;