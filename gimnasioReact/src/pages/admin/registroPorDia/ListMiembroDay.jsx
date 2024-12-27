//Estados
import { useEffect, useState } from "react";

//API
import { getMembersDay } from '../../../api/userGymDay.api';

import { createColumnHelper } from '@tanstack/react-table';

//Componente principal para la listas
import Table from '../../../component/Table';
//Enlaces
import { Link } from "react-router-dom";


const ListMiembroDay = () => {
    const [users, setUser] = useState([]);

    useEffect(() => {
        const axiosUserData = async () => {
            try {
                const data = await getMembersDay();
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
            cell: (info) => {
                // Solo mostrar el número si no es la fila de total
                return info.row.original.id !== 'total' ? info.row.index + 1 : '';
            },
        }),
        columnHelper.accessor('name', {
            header: 'Nombre',
            cell: (info) => {
                const value = info.getValue();
                // Si es la fila de total, mostrar en negrita y centrado
                return info.row.original.id === 'total' ? (
                    <div className="font-bold text-right">Total:</div>
                ) : value;
            }
        }),
        columnHelper.accessor('lastname', {
            header: 'Apellido',
            cell: (info) => info.row.original.id === 'total' ? '' : info.getValue()
        }),
        columnHelper.accessor('phone', {
            header: 'Telefono',
            cell: (info) => info.row.original.id === 'total' ? '' : info.getValue()
        }),
        columnHelper.accessor('dateInitial', {
            header: 'Fecha Inicial',
            cell: (info) => info.row.original.id === 'total' ? '' : info.getValue()
        }),
        columnHelper.accessor('price', {
            header: 'Precio',
            cell: info => {
                const price = parseFloat(info.getValue());
                if (!isNaN(price)) {
                    // Si es la fila de total, mostrar en negrita
                    return info.row.original.id === 'total' ? (
                        <div className="font-bold">${price.toFixed(2)}</div>
                    ) : `$${price.toFixed(2)}`;
                }
                return '$0.00';
            },
        }),
        columnHelper.accessor('actions', {
            header: 'Acciones',
            cell: (({ row }) => {
                // No mostrar botones si es la fila de total
                if (row.original.id === 'total') return null;
                
                return (
                    <div className="flex justify-center items-center gap-x-4">
                        <Link to={`/edit/usuarios/${row.original.id}`} className="bg-green-500 text-white p-2 rounded-md">
                            Editar
                        </Link>
                        <button className="bg-red-500 text-white p-2 rounded-md">
                            Eliminar
                        </button>
                    </div>
                );
            }),
        }),
    ];

    //Calculamos el total de los precios
    const total = users.reduce((acc, user) => acc + parseFloat(user.price), 0);

    // Añadir una fila extra con el total
    const dataWithTotal = [...users, { id: 'total', name: 'Total', price: total.toFixed(2) }];

    return (
        <main className="cards bg-secondary w-full flex flex-col justify-center items-center gap-y-4 p-4 rounded-xl">
            <h1 className='text-xl font-bold pb-4'>Listado de Miembros</h1>
            <Table data={dataWithTotal} columns={columns} />
        </main>
    );
}
export default ListMiembroDay;