//Estados
import { useCallback, useEffect, useState } from "react";
//API
import { getMembers, deleteMember } from '../../../api/userGym.api';
//Table
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
//Componente principal para la listas
import Table from '../../../components/Table';
//Enlaces
import { Link } from "react-router-dom";
//Mensajes
import { toast } from 'react-hot-toast';
//Models
import { Miembro } from "../../../model/member.model";
//Icons
import { RiDeleteBinLine, RiPencilLine } from "react-icons/ri";

interface MiembroTotal {
    id: 'total';
    name: string;
    lastname?: string;
    phone?: string;
    address?: string;
    dateInitial?: string;
    dateFinal?: string;
    price: number | string;
}

type Member = MiembroTotal | Miembro;

const ListMiembro = () => {
    const [users, setUser] = useState<Miembro[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredData, setFilteredData] = useState<number | null>(null);
    const [search, setSearch] = useState('');

    // Función en donde se buscan los datos
    const handleSearch = useCallback(async(user: string) => {
        setIsLoading(true);
        try {
            const response = await getMembers(user);
            setUser(response);
        } catch (error) {
            console.error('Error al buscar el miembro:', error);
            
        }finally {
            setIsLoading(false);
        }       
    }, []);
    
    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const response = await getMembers();
                setUser(response);
            }catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Error al cargar los datos';
                toast.error(errorMessage);
            }finally {
                setIsLoading(false);
            }
        };
        fetchUserData();

        //Limpiamos el timeout cada vez que se renderiza la página
        return () => {
            if (filteredData) clearTimeout(filteredData);
        };
    }, []);

    //Manejamos el evento de búsqueda
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value.toLowerCase();
        setSearch(searchValue);

        if (filteredData) clearTimeout(filteredData);

        setFilteredData(setTimeout(() => {
            handleSearch(searchValue)
        }, 500));
    }

    const columnHelper = createColumnHelper<Member>();

    //Calculamos el total de los precios
    //const total = users.reduce((acc, user) => acc + Number((user.price)), 0);
    // const total = users.reduce((acc, user) => {
    //     const price = typeof user.price === 'string' ? parseFloat(user.price) : user.price;
    //     return acc + price;
    // }, 0);
        

    // const totalRow: MiembroTotal = {
    //     id: 'total',
    //     name: 'Total',
    //     price: `$ ${total}`, 
    // };
    
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
        columnHelper.accessor(row => row.address, {
            id: 'address',
            header: 'Dirección',
            cell: (info) => info.getValue()
        }),
        // columnHelper.accessor(row => row.dateInitial, {
        //     id: 'dateInitial',
        //     header: 'Fecha Inicial',
        //     cell: (info) => info.getValue()
        // }),
        // columnHelper.accessor(row => row.dateFinal, {
        //     id: 'dateFinal',
        //     header: 'Fecha Final',
        //     cell: (info) => info.getValue()
        // }),
        // columnHelper.accessor('price', {
        //     id: 'price',
        //     header: 'Precio',
        //     cell: info => {
        //         const isTotalRow = info.row.original.id === 'total';
        //         const raw = info.getValue<Member['price']>();
        //         const priceNum  = typeof raw === 'string' ? parseFloat(raw) : raw;              
        //         // Si es la fila de total, mostrar en negrita
        //         return (
        //             <div className={isTotalRow ? 'font-bold' : ''}>
        //                 ${priceNum.toFixed(2)}
        //             </div>
        //         )              
        //     },
        // }),
        columnHelper.display({
            id: 'actions',
            header: 'Acciones',
            cell: props => {
                const id = props.row.original.id;
                //si es la fila total, no mostrar botones
                if(typeof id !== 'number') return null;
                return(
                    <div className="flex justify-center items-center gap-x-4">
                        <Link to={`/dashboard/miembro/${id}`} className="bg-green-500 text-white p-2 rounded-md hover:scale-110">
                            <RiPencilLine />
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
                            className="bg-red-500 text-white p-2 rounded-md hover:scale-110">
                            <RiDeleteBinLine />
                        </button>
                    </div>
                );
            },           
        }),
    ] as ColumnDef<Member>[];    

    return (
        <main className="cards bg-secondary w-full flex flex-col justify-center items-center gap-y-4 p-4 rounded-xl">            
            <h1 className='text-xl font-bold pb-4 md:text-2xl md:pt-2'>Listado de Miembros</h1>
            {/* Busqueda */}
            <section className="flex justify-end items-center gap-x-4 p-4 md:w-96">
                <input 
                    type="text"
                    placeholder="Buscar miembro..."
                    className="bg-gray-100 rounded-md outline-slate-400 p-2 w-full md:w-1/2"
                    value={search}
                    onChange={handleSearchChange}
                />
            </section>
            {
                isLoading ? (
                    <div className="text-center py-4">Buscando...</div>
                ) : (
                        <Table 
                            data={users} 
                            columns={columns} 
                            // totalRow={totalRow} 
                        />
                    )
            }                         
        </main>
    );
}
export default ListMiembro;