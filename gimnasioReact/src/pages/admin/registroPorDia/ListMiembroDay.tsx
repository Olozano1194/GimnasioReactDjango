//Estados
import { useEffect, useState } from "react";
//API
import { getMembersDay, deleteMember } from '../../../api/userGymDay.api';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
//Componente principal para la listas
import Table from '../../../components/Table';
//Enlaces
import { Link } from "react-router-dom";
//Mensajes
import { toast } from 'react-hot-toast';
//Models
import { MemberDay } from "../../../model/memberDay.model";

interface MiembroTotal {
    id: 'total';
    name: string;
    lastname?: string;
    phone?: string;
    dateInitial?: string;
    price: number | string;
};

type DayMember = MiembroTotal | MemberDay;


const ListMiembroDay = () => {
    const [users, setUser] = useState<MemberDay[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const data = await getMembersDay();
                setUser(data);
            }catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Error al cargar los datos';
                toast.error(errorMessage);
            }finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const columnHelper = createColumnHelper<DayMember>();

     //Calculamos el total de los precios
     const total = users.reduce((acc, user) => {
        const price = typeof user.price === 'string' ? parseFloat(user.price) : user.price;
        return acc + price;
    }, 0);

    const totalRow: MiembroTotal = {
        id: 'total',
        name: 'Total',
        price: `$ ${total}`, 
    };

    const columns = [
        columnHelper.accessor((_, index) => index + 1, {
            id: 'index',
            header: 'N°',
            cell: (info) => {
                // Solo mostrar el número si no es la fila de total
                return info.row.index + 1;
            },
        }),
        columnHelper.accessor(row => `${row.name}`, {
            id: 'name',
            header: 'Nombre',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor(row => row.lastname, {
            id: 'lastname',
            header: 'Apellido',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor(row => row.phone, {
            id: 'phone',
            header: 'Telefono',
            cell: (info) => info.getValue()
        }),
        columnHelper.accessor(row => row.dateInitial, {
            id: 'dateInitial',
            header: 'Fecha Inicial',
            cell: (info) => info.getValue()
        }),
        columnHelper.accessor('price', {
            id: 'price',
            header: 'Precio',
            cell: info => {
                const isTotalRow = info.row.original.id === 'total';
                const raw = info.getValue<DayMember['price']>();
                const priceNum  = typeof raw === 'string' ? parseFloat(raw) : raw;              
                // Si es la fila de total, mostrar en negrita
                return (
                    <div className={isTotalRow ? 'font-bold' : ''}>
                        ${priceNum.toFixed(2)}
                    </div>
                )              
            },
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Acciones',
            cell: props => {
                const id = props.row.original.id;
                //si es la fila total, no mostrar botones
                if(typeof id !== 'number') return null;

                return (
                    <div className="flex justify-center items-center gap-x-4">
                        <Link to={`/dashboard/miembro-day/${id}`} className="bg-green-500 text-white p-2 rounded-md">
                            Editar
                        </Link>
                        <button
                            onClick={ async () => {
                                if (window.confirm('¿Estás seguro de eliminar este miembro?')){
                                    try {
                                        await deleteMember(id);
                                        setUser(users.filter(user => user.id !== id));
                                        toast.success('Miembro Eliminado', {
                                            duration: 3000,
                                            position: 'bottom-right',
                                            style: {
                                                background: '#4b5563',   // Fondo negro
                                                color: '#fff',           // Texto blanco
                                                padding: '16px',
                                                borderRadius: '8px',
                                            },
                                        }); 
                                    } catch (error) {
                                        const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la membresía';
                                        toast.error(errorMessage);                                        
                                    }
                                }                                
                             }} 
                            className="bg-red-500 text-white p-2 rounded-md">
                                Eliminar
                        </button>
                    </div>
                );
            },
        }),
    ] as ColumnDef<DayMember>[];
    
    return (
        <main className="cards bg-secondary w-full flex flex-col justify-center items-center gap-y-4 p-4 rounded-xl">
            <h1 className='text-xl font-bold pb-4'>Listado de Miembros</h1>
            {
                isLoading ? (
                    <div className="text-center py-4">Cargando...</div>

                ): (
                    <Table 
                        data={users} 
                        columns={columns} 
                        totalRow={totalRow} 
                    />
                )
            }
        </main>
    );
}
export default ListMiembroDay;