import {useForm} from 'react-hook-form';
import { useParams, useNavigate } from "react-router-dom";
//Estados
import { useEffect, useState } from "react";
//Icons
import { RiLoginBoxLine } from "react-icons/ri";
import { FaTag } from 'react-icons/fa';
import { BsCalendar2Date } from "react-icons/bs";
import { CiUser } from 'react-icons/ci';
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

interface FormData {
    miembro: string;
    membresia: string;
    dateInitial: string;
}

const MemberShipsForm = () => {
    const [miembros, setMiembros] = useState<Miembro[]>([]);
    const [membresias, setMembresias] = useState<Membresia[]>([]);
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

            //Para la creación/actualización solo enviamos los Ids y las fechas
            const requestData: CreateAsignarMemberShipsDto = {
                miembro: miembroId, 
                membresia: membresiaId, 
                dateInitial: data.dateInitial,                
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
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                toast.error(errorMessage, {
                    duration: 3000,
                    position: 'bottom-right',
                });                    
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
                    console.log("Datos de la asignación para editar:", responseAsignacion);
    
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
        
    
    return (
        <main className="w-full min-h-screen flex flex-col justify-center items-center">
            <form onSubmit={onSubmit} className="formRegister w-[85%] bg-slate-300 flex flex-col justify-center items-center text-slate-600 gap-6 p-3 rounded-md m-7 md:w-[55%] md:gap-8 lg:w-[47%] lg:px-8 xl:max-w-[43%]">
                <h1 className="text-xl font-bold pt-3 pb-2 md:pt-3">{ params.id ? 'Actualizar la Asignación de Membresía' : 'Asignar Membresía' }</h1>

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
                        <option key={miembro.id} value={miembro.id?.toString()}>{miembro.name}</option>
                    ))}
                    </select>
                </Label>
                {
                    errors.miembro && typeof errors.miembro.message === 'string' && <span className='text-red-500 text-sm'>{errors.miembro.message}</span>                }
                
                {/* Membreship */}
                <Label htmlFor="Membresia"><span className='flex gap-2 items-center'><FaTag className='lg:text-2xl' />Membresía</   span><select className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-dark text-lg placeholder:text-gray-500'
                {...register('membresia',{
                    required: {
                        value: true,
                        message: 'Membresia requerido'
                    },                    
                })} 
                >
                    <option value="">Seleccione una Membresía</option>
                    {membresias.map((membresia) => (
                        <option key={membresia.id} value={membresia.id?.toString()}>{membresia.name}</option>
                    ))}
                    
                </select>
                </Label>
                {
                    errors.membresia && typeof errors.membresia.message === 'string' && <span className='text-red-500 text-sm'>{errors.membresia.message}</span>
                }
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