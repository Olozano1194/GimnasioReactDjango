//Estados
import { useCallback, useEffect, useState } from "react";
//API
import { getAsignarMemberList, deleteAsignarMemberShips } from '../../../api/asignarMemberShips.api';
//models
import { AsignarMemberShips } from '../../../model/asignarMemberShips.model';
// Table
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
//Componente principal para la listas
import Table from '../../../components/Table';
//Enlaces
import { Link } from "react-router-dom";
//Mensajes
import { toast } from 'react-hot-toast';
//Icons
import { RiDeleteBinLine, RiPencilLine } from "react-icons/ri";

interface AsignacionTotal {
    id: 'total';
    name: string;
    miembro_details?: {
        id: number;
        name: string;
        lastname: string;        
    };
    membresia_details?: {
        id: number;
        name: string;
        price: number;        
    };
    dateInitial?: string;
    dateFinal?:   string;
    price: number | string;
}

type Asignacion = AsignacionTotal | AsignarMemberShips;

const ListAsignarMemberShips = () => {    
    const [asignarMemberShips, setAsignarMemberShips] = useState<Asignacion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredData, setFilteredData] = useState<number | null>(null);
    const [search, setSearch] = useState('');

    // Función en donde se buscan los datos
    const handleSearch = useCallback(async(user: string) => {
        setIsLoading(true);
        try {
            const response = await getAsignarMemberList(user);
            setAsignarMemberShips(response);
        } catch (error) {
            console.error('Error al buscar el miembro diario:', error);
        }finally {
            setIsLoading(false);
        }       
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {                
                const response = await getAsignarMemberList();
                //console.log('Datos recibidos:', response);                
                setAsignarMemberShips(response);

            }catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Error al cargar los datos';
                toast.error(errorMessage);
            }finally {
                setIsLoading(false);
            }
        };
        fetchData();
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

    const columnHelper = createColumnHelper<Asignacion>();

    //Función para dar formato a la moneda en este caso pesos colombianos
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        }).format(amount);
    };

    //Calculamos el total de los precios
    //const total = users.reduce((acc, user) => acc + Number((user.price)), 0);
    const total = asignarMemberShips.reduce((acc, item) => {
        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        return acc + price;
    }, 0);        

    const totalRow: AsignacionTotal & { nombreCompleto?: string } = {
        id: 'total',
        name: 'Total',
        nombreCompleto: 'Total',
        price: formatCurrency(total),
        //price: total       
    };

    //const rowsConTotal: Asignacion[] = [...asignarMemberShips, totalRow];    

    const columns = [
        columnHelper.display({
            id: 'index',
            header: 'N°',
            cell: info => info.row.index + 1,                      
        }),
        columnHelper.accessor(row => {
            if (row.id === 'total') return row.name;
            return `${row.miembro_details?.name} ${row.miembro_details?.lastname}`;
        }, {
            id: 'nombreCompleto',
            header: 'Nombre',
            cell: (info) => info.getValue(),            
        }),
        columnHelper.accessor(row => row.membresia_details?.name, {
            id: 'membresia',
            header: 'Membresía',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor(row => row.dateInitial, {
            id: 'dateInitial',
            header: 'Fecha Inicial',
            cell: (info) => info.getValue()
        }),
        columnHelper.accessor(row => row.dateFinal, {
            id: 'dateFinal',
            header: 'Fecha Final',
            cell: (info) => info.getValue()
        }),
        columnHelper.accessor('price', {
            id: 'price',
            header: 'Precio',
            cell: info => {
                const isTotalRow = info.row.original.id === 'total';
                const raw = info.getValue<Asignacion['price']>();
                const priceNum  = typeof raw === 'string' ? parseFloat(raw) : raw;                              
                // Si es la fila de total, mostrar en negrita
                return (
                    <div className={isTotalRow ? 'font-bold text-gray-50' : ''}>
                        {formatCurrency(priceNum)}
                    </div>
                )          
            },
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Acciones',
            cell: props => {
                const id = props.row.original.id;
                // No mostrar botones si es la fila de total
                if(typeof id !== 'number') return null;
                return (
                    <div className="flex justify-center items-center gap-x-4">
                        <Link to={`/dashboard/asignar-membresia/${id}`} className="bg-green-500 text-white p-2 rounded-md hover:scale-110">
                            <RiPencilLine />
                        </Link>
                        <button
                            onClick={ async () => {
                                if (window.confirm('¿Estás seguro de eliminar esta asignación?')) {
                                    try {
                                        await deleteAsignarMemberShips(id);
                                        setAsignarMemberShips(asignarMemberShips.filter(asignarmemberShips => asignarmemberShips.id !== id));
                                        toast.success('Membresía Eliminada', {
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
                
        ] as ColumnDef<Asignacion>[];
        
        return (
            <main className="cards bg-secondary w-full flex flex-col justify-center items-center gap-y-4 p-4 rounded-xl">            
                <h1 className='text-xl font-bold pb-4'>Listado de Asignaciones</h1>
                    {/* Busqueda */}
                    <section className="flex justify-end items-center gap-x-4 p-4 md:w-96">
                        <input 
                            type="text"
                            placeholder="Buscar asignación..."
                            className="bg-gray-100 rounded-md outline-slate-400 p-2 w-full md:w-1/2"
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </section>
                    {
                        isLoading ? (
                            <div className="text-center py-4">Cargando...</div>         

                        ) : (                            
                            <Table 
                                data={asignarMemberShips} 
                                columns={columns}
                                totalRow={totalRow}                                 
                            />
                        )
                    }             
            </main>
        );
};
export default ListAsignarMemberShips;