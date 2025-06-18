import {useForm} from 'react-hook-form';
import { useParams, useNavigate } from "react-router-dom";
//Estados
import { useEffect, useState } from "react";
//Icons
import { RiLoginBoxLine } from "react-icons/ri";
import { FaTag } from 'react-icons/fa';
import { BsCalendar2Date } from "react-icons/bs";
import { CiUser } from 'react-icons/ci';
import { PiCurrencyDollarBold } from 'react-icons/pi';
//Mensajes
import { toast } from "react-hot-toast";
//ui
import { Input, Label, Button } from '../../../components/ui/index';
//API
//MemberShips
import { getMemberList } from '../../../api/memberShips.api';
//Member
import { getMembers } from "../../../api/userGym.api";
//Asignación Membresías
import { createAsignarMemberShips, updateAsignarMemberShips, getAsignarMemberShips } from '../../../api/asignarMemberShips.api';
//Models
import { Membresia } from '../../../model/memberShips.model';
import { Miembro } from '../../../model/member.model';
import { CreateAsignarMemberShipsDto } from '../../../model/dto/asignarMemberShips.dto';
//img
import Logo from '../../../../public/favicon-32x32.png';

interface FormData {
    miembro: string;
    membresia: string;
    dateInitial: string;
}

const MemberShipsForm = () => {
    const [miembros, setMiembros] = useState<Miembro[]>([]);
    const [membresias, setMembresias] = useState<Membresia[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const params = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: {errors}, reset } = useForm<FormData>();       
    
    const onSubmit = handleSubmit(async (data: FormData) => {
        //console.log('Form data:', data);        
        try {
            const miembroId = parseInt(data.miembro);
            const membresiaId = parseInt(data.membresia);
                
            if(isNaN(miembroId) || isNaN(membresiaId)){
                toast.error('Por favor, selecciona un miembro y una membresía válidos');
                return;
            }

            //Encontrar la membresía para seleccionar la duración
            const selectMembresia = membresias.find((m) => m.id === membresiaId);
            if (!selectMembresia) {
                toast.error('Membresía no encontrada');
                return;
            }

            //Calculamos la fecha final
            const initialDate = new Date(data.dateInitial);
            const finalDate = new Date(initialDate);
            finalDate.setDate(finalDate.getDate() + selectMembresia.duration);

            //Formateamos la fecha en el formato correcto
            const dateInitial = initialDate.toISOString().split('T')[0];
            const dateFinal = finalDate.toISOString().split('T')[0];

            //Para la creación/actualización solo enviamos los Ids y las fechas
            const requestData: CreateAsignarMemberShipsDto = {
                miembro: miembroId, 
                membresia: membresiaId, 
                dateInitial: dateInitial,
                dateFinal: dateFinal
            };
            //console.log('Datos que serán enviados:', requestData);
            
            if (params.id) {
                await updateAsignarMemberShips(parseInt(params.id), requestData);
                //console.log('Actualizando miembro:', params.id);
                toast.success('Asignación de Membresía Actualizada', {
                    duration: 3000,
                    position: 'bottom-right',
                    style: {
                        background: '#4b5563',   // Fondo negro
                        color: '#fff',           // Texto blanco
                        padding: '16px',
                        borderRadius: '8px',
                    },
                });                 
            }else {
                await createAsignarMemberShips(requestData);
                //console.log('Respuesta del servidor:',rest.data);            
                toast.success('Asignación de Membresía Creada', {
                    duration: 3000,
                    position: 'bottom-right',
                    style: {
                        background: '#4b5563',   // Fondo negro
                        color: '#fff',           // Texto blanco
                        padding: '16px',
                        borderRadius: '8px',
                    },
                });
                reset();                
            }
            navigate('/dashboard/asignar-membresia-list');
                    
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error detallado:', error);
                toast.error(`Error: ${error.message}`);
                
            }else {
                console.error('Error desconocido:', error);
                toast.error('Error desconocido al procesar la solicitud');
            }
            // const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            //     toast.error(errorMessage, {
            //         duration: 3000,
            //         position: 'bottom-right',
            //     });                    
        }            
    });
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Cargar listas de miembros y membresías
                const responseMemberShips: Membresia[] = await getMemberList(); // Función para obtener la lista de membresías
                const responseMembers: Miembro[] = await getMembers(); // Función para obtener la lista de miembros

                setMembresias(responseMemberShips);
                setMiembros(responseMembers);
                
    
                // Si params.id está presente, cargar los datos específicos para actualizar
                if (params.id) {
                    const responseAsignacion = await getAsignarMemberShips(parseInt(params.id)); // Función para obtener una asignación específica
                    //console.log("Datos de la asignación para editar:", responseAsignacion);

                    //formateamos la fecha antes de pasarla al formulario
                    if (responseAsignacion.dateInitial && responseAsignacion.dateFinal) {
                        responseAsignacion.dateInitial = formatDate(responseAsignacion.dateInitial);
                        responseAsignacion.dateFinal = formatDate(responseAsignacion.dateFinal);                        
                    }
    
                    // Prellenar los campos del formulario con los datos existentes
                    reset({
                        miembro: responseAsignacion.miembro.toString(),
                        membresia: responseAsignacion.membresia.toString(),
                        dateInitial: responseAsignacion.dateInitial,
                        //dateFinal: responseAsignacion.dateFinal,
                    });
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Error al cargar los datos';
                toast.error(errorMessage);
            }
        };
    
        fetchData();
    }, [params.id, reset]);

    const formatDate = (date: string): string => {
        if (!date) return ''; // Retorna un valor vacío si la fecha es undefined o null
        try {
            const [day, month, year] = date.split('-');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } catch (error) {
            console.error('Error al formatear la fecha:', error);
            return '';
        }
    };

    const handleMemberShipsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const membresiaId = parseInt(event.target.value);
        const selectedMembresia = membresias.find((membresia) => membresia.id === membresiaId);

        if (selectedMembresia) {
            setSelectedPrice(selectedMembresia.price);
        }else {
            setSelectedPrice(null);
        }
    };
        
    
    return (
        <main className="w-full min-h-screen flex flex-col justify-center items-center">
            <form onSubmit={onSubmit} className="formRegister w-full bg-slate-300 flex flex-col justify-center items-center text-slate-600 gap-6 p-3 rounded-md m-7 md:w-[55%] md:gap-8 lg:w-[47%] lg:px-8 xl:max-w-[43%]">
                <div className='w-full flex justify-center'>
                    <h1 className="text-2xl font-bold flex justify-center items-center pb-2 md:pt-3 md:text-3xl"><img className='w-9 h-7 rounded-lg mr-1' src={Logo} alt="" />{ 
                        params.id ? (
                            <>
                            Actualizar 
                            <span className='text-sky-600 pl-2'>Asignación</span>
                            </>) 
                            : (
                            <>
                            Asignar
                            <span className='text-sky-600 pl-2'>Membresía</span>
                            </>
                        )}
                    </h1>
                </div>
                {/* Miembro */}
                <Label htmlFor="Miembro"><span className='flex gap-2 items-center'><CiUser className='lg:text-2xl xl:text-xl' />Miembro</span><select className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-dark text-lg placeholder:text-gray-500'
                {...register('miembro',{
                    required: {
                        value: true,
                        message: 'Nombre requerido'
                    },                   
                })}
                >
                    <option value="">Seleccione un Miembro</option>
                    {miembros.map((miembro) => (
                        <option key={miembro.id} value={miembro.id?.toString()}>{miembro.name} {miembro.lastname}</option>
                    ))}
                    </select>
                </Label>
                {
                    errors.miembro && typeof errors.miembro.message === 'string' && <span className='text-red-500 text-sm'>{errors.miembro.message}</span>                }
                
                {/* Membreship */}
                <Label htmlFor="Membresia"><span className='flex gap-2 items-center'><FaTag className='lg:text-2xl' />Membresía</span><select className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-dark text-lg placeholder:text-gray-500'
                {...register('membresia',{
                    required: {
                        value: true,
                        message: 'Membresia requerido'
                    },                    
                })}
                onChange={(e) => {
                    register('membresia').onChange(e);
                    handleMemberShipsChange(e);
                }} 
                >
                    <option value="">Seleccione una Membresía</option>
                    {membresias.map((membresia) => (
                        <option key={membresia.id} value={membresia.id?.toString()}>{membresia.name} - ${membresia.price}</option>
                    ))}
                    
                </select>
                </Label>
                {
                    errors.membresia && typeof errors.membresia.message === 'string' && <span className='text-red-500 text-sm'>{errors.membresia.message}</span>
                }
                { selectedPrice !== null && (
                    // <div className='text-lg font-semibold'>
                    //     Precio: ${selectedPrice}
                    // </div>
                    <label htmlFor="" ><span className='flex gap-1 justify-center items-center font-semibold text-xl text-slate-600'><PiCurrencyDollarBold className='lg:text-2xl xl:text-xl'/>Precio</span><div className='w-full border-solid border-b-2 border-slate-100 bg-slate-300 font-semibold outline-none pt-3 text-slate-600 text-2xl text-center'>$ {selectedPrice}</div></label>

                )}
                {/* Date Initial */}
                <Label htmlFor="DateInitial"><span className='flex gap-2 items-center'><BsCalendar2Date className='lg:text-2xl' />Fecha Inicial</span><Input type="date"
                {...register('dateInitial',{
                    required: {
                        value: true,
                        message: 'Fecha requerido'
                    },                    
                })} 
                />
                </Label>
                {
                    errors.dateInitial && typeof errors.dateInitial.message === 'string' && <span className='text-red-500 text-center text-sm'>{errors.dateInitial.message}</span>
                }
                {/* Date final */}
                {/* <Label htmlFor="DateFinal"><span className='flex gap-2 items-center'><BsCalendar2Date className='lg:text-2xl' />Fecha Final</span><Input type="date"
                {...register('dateFinal',{
                    required: {
                        value: true,
                        message: 'Fecha requerido'
                    },                    
                })} 
                />
                </Label>
                {
                    errors.dateFinal && typeof errors.dateFinal.message === 'string' && <span className='text-red-500 text-center text-sm'>{errors.dateFinal.message}</span>
                } */}
                {/* btn Register */}
                <Button type="submit">
                    <RiLoginBoxLine className='text-purple-800' />{ params.id ? 'Actualizar' : 'Asignar' }
                    
                </Button>                
            </form>
        </main>
    );
};
export default MemberShipsForm;