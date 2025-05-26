//Estados
import { useEffect, useState } from "react";
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


const ListAsignarMemberShips = () => {
    const [asignarMemberShips, setAsignarMemberShips] = useState<AsignarMemberShips[]>([]);
    const [isLoading, setIsLoading] = useState(false);

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
    }, []);

    const columnHelper = createColumnHelper<AsignarMemberShips>();

    const columns = [
        columnHelper.accessor((_, index) => index + 1, {
            id: 'index',
            header: 'N°',
            cell: (info) => {
                // Solo mostrar el número si no es la fila de total
                return info.row.index + 1;
            },
        }),
        columnHelper.accessor(row => `${row.miembro_details.name} ${row.miembro_details.lastname}`, {
            id: 'nombreCompleto',
            header: 'Nombre del Miembro',
            cell: (info) => info.getValue(),            
        }),
        columnHelper.accessor(row => row.membresia_details.name, {
            id: 'membresia',
            header: 'Membresía',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('dateInitial', {
            header: 'Fecha Inicial',
            cell: info => new Date(info.getValue()).toLocaleDateString(),
        }),
        columnHelper.accessor('dateFinal', {
            header: 'Fecha Final',
            cell: info => new Date(info.getValue()).toLocaleDateString(),
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Acciones',
            cell: props => (

                // No mostrar botones si es la fila de total
                //if (props.row.original.id === 'total') return null;
                <div className="flex justify-center items-center gap-x-4">
                <Link to={`/dashboard/membresia/${props.row.original.id}`} className="bg-green-500 text-white p-2 rounded-md hover:scale-110">
                    <RiPencilLine />
                </Link>
                <button
                    onClick={ async () => {
                        if (window.confirm('¿Estás seguro de eliminar esta asignación?')) {
                            try {
                                await deleteAsignarMemberShips(props.row.original.id);
                                setAsignarMemberShips(asignarMemberShips.filter(asignarmemberShips => asignarmemberShips.id !== props.row.original.id));
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
        ),
    }),
] as ColumnDef<AsignarMemberShips>[];
return (
        <main className="cards bg-secondary w-full flex flex-col justify-center items-center gap-y-4 p-4 rounded-xl">            
            <h1 className='text-xl font-bold pb-4'>Listado de Asignaciones de Membresías</h1>

            {isLoading ? (
                <div className="text-center py-4">Cargando...</div>
            ): (
                <Table data={asignarMemberShips} columns={columns}  />
            )}           
        </main>
    );

};
export default ListAsignarMemberShips;