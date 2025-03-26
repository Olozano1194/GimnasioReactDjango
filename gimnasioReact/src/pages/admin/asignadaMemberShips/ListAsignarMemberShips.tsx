//Estados
import { useEffect, useState } from "react";
//API
import { getAsignarMemberList, deleteAsignarMemberShips } from '../../../api/asignarMemberShips.api';

import { createColumnHelper } from '@tanstack/react-table';

//Componente principal para la listas
import Table from '../../../components/Table';
//Enlaces
import { Link } from "react-router-dom";
//Mensajes
import { toast } from 'react-hot-toast';

const ListAsignarMemberShips = () => {
    const [memberShips, setMemberShips] = useState([]);

    useEffect(() => {
        const axiosUserData = async () => {
            try {
                const data = await getAsignarMemberList();
                setMemberShips(data);
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
            cell: (info) => {
                // Solo mostrar el número si no es la fila de total
                return info.row.index + 1;
            },
        }),
        columnHelper.accessor('miembro', {
            header: 'Nombre del Miembro',
            cell: (info) => {
                const miembro = info.getValue();
                return `${miembro.name} ${miembro.lastname}`;                 
            }
        }),
        columnHelper.accessor('membresia.name', {
            header: 'Membresía',
            // cell: (info) => info.row.original.id === 'total' ? '' : info.getValue()
        }),
        columnHelper.accessor('dateInitial', {
            header: 'Fecha Inicial',
            //cell: info => info.row.original.id === 'total' ? '' : info.getValue()
        }),
        columnHelper.accessor('dateFinal', {
            header: 'Fecha Final',
            //cell: info => info.row.original.id === 'total' ? '' : info.getValue()
        }),
        columnHelper.accessor('actions', {
            header: 'Acciones',
            cell: (({ row }) => {
                // No mostrar botones si es la fila de total
                if (row.original.id === 'total') return null;
                
                return (
                    <div className="flex justify-center items-center gap-x-4">
                        <Link to={`/dashboard/membresia/${row.original.id}`} className="bg-green-500 text-white p-2 rounded-md">
                            Editar
                        </Link>
                        <button
                            onClick={ async () => {
                                const accepted = window.confirm('¿Estás seguro de eliminar este miembro?');
                                if (accepted) {
                                    await deleteAsignarMemberShips(row.original.id);
                                    setUser(memberShips.filter(memberShips => memberShips.id !== row.original.id));
                                    toast.success('Membresía Eliminada', {
                                        duration: 3000,
                                        position: 'bottom-right',
                                        style: {
                                            background: '#4b5563',   // Fondo negro
                                            color: '#fff',           // Texto blanco
                                            padding: '16px',
                                            borderRadios: '8px',
                                        },
                
                                    });  
                                }                                
                             }} 
                            className="bg-red-500 text-white p-2 rounded-md">
                                Eliminar
                        </button>
                    </div>
                );
            }),
        }),
    ];

    //Calculamos el total de los precios
    //const total = memberShips.reduce((acc, user) => acc + parseFloat(user.price), 0);

    // Añadir una fila extra con el total
    //const dataWithTotal = [...users, { id: 'total', name: 'Total', price: total.toFixed(2) }];

    return (
        <main className="cards bg-secondary w-full flex flex-col justify-center items-center gap-y-4 p-4 rounded-xl">
            <h1 className='text-xl font-bold pb-4'>Listado de Membresías</h1>
            <Table data={memberShips} columns={columns}  />
        </main>
    );

};
export default ListAsignarMemberShips;