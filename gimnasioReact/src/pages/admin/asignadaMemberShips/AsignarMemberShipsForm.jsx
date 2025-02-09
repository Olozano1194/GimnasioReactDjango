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
import { Input, Label, Button } from '../../../component/ui/index';

//API
//MemberShips
import { getMemberList } from '../../../api/memberShips.api';
//Member
import { getMembers } from "../../../api/userGym.api";
//Asignación Membresías
import { createAsignarMemberShips, updateAsignarMemberShips } from '../../../api/asignarMemberShips.api';



const MemberShipsForm = () => {
    const [miembros, setMiembros] = useState([]);
    const [membresias, setMembresias] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: {errors}, watch, reset } = useForm();
       
    
    const onSubmit = handleSubmit(async (data) => {
        //console.log('Form data:', data);
        try {
            const requestData = {
            miembro: data.miembro, 
            membresia: data.Membresia, 
            dateInitial: data.dateInitial,
            dateFinal: data.dateFinal,
            };
            console.log('Datos que serán enviados:', requestData);
            
            if (params.id) {
                await updateAsignarMemberShips(params.id, requestData);
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
            navigate('/dashboard');
                    
        } catch (error) {
            console.error("Error al registrar el usuario:", error.response ? error.response.data : error.message);
            toast.error('Ocurrió un error. Inténtalo de nuevo.', {
                duration: 3000,
                position: 'bottom-right',
            });            
        }
            
    });
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Cargar listas de miembros y membresías
                const responseMemberShips = await getMemberList();
                setMembresias(responseMemberShips);
    
                const responseMembers = await getMembers();
                setMiembros(responseMembers);
    
                // Si params.id está presente, cargar los datos específicos para actualizar
                if (params.id) {
                    const responseAsignacion = await getAsignacionMembresia(params.id); // Función para obtener una asignación específica
                    console.log("Datos de la asignación para editar:", responseAsignacion);
    
                    // Prellenar los campos del formulario con los datos existentes
                    reset({
                        miembro: responseAsignacion.miembro,
                        membresia: responseAsignacion.membresia,
                        fechaInicio: responseAsignacion.fechaInicio,
                        fechaFin: responseAsignacion.fechaFin,
                    });
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
                toast.error("Error al cargar los datos. Por favor, intenta nuevamente.");
            }
        };
    
        fetchData();
    }, [params.id, reset]);
    
    
    
    return (
        <main className="w-full min-h-screen flex flex-col justify-center items-center">
            <form onSubmit={onSubmit} className="formRegister w-[85%] bg-slate-300 flex flex-col justify-center items-center text-slate-600 gap-6 p-3 rounded-md m-7 md:w-[55%] md:gap-8 lg:w-[47%] lg:px-8 xl:max-w-[43%]">
                <h1 className="text-xl font-bold pt-3 pb-2 md:pt-3">{ params.id ? 'Actualizar la Asignación de Membresía' : 'Asignar Membresía' }</h1>

                {/* Miembro */}
                <Label htmlFor="Miembro"><span className='flex gap-2 items-center'><CiUser className='lg:text-2xl xl:text-xl' />Niembro</span><select name='miembro_id' className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-dark text-lg placeholder:text-gray-500'
                {...register('miembro',{
                    required: {
                        value: true,
                        message: 'Nombre requerido'
                    },                   
                })}
                >
                    <option value="">Seleccione un Miembro</option>
                    {miembros.map((miembro) => (
                        <option key={miembro.id} value={miembro.id}>{miembro.name}</option>
                    ))}
                    </select>
                </Label>
                {
                    errors.miembro && <span className='text-red-500 text-sm'>{errors.miembro.message}</span>                }
                
                {/* Membreship */}
                <Label htmlFor="Membresia"><span className='flex gap-2 items-center'><FaTag className='lg:text-2xl' />Membresía</   span><select name='membresia_id' className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-dark text-lg placeholder:text-gray-500'
                {...register('Membresia',{
                    required: {
                        value: true,
                        message: 'Membresia requerido'
                    },                    
                })} 
                >
                    <option value="">Seleccione una Membresía</option>
                    {membresias.map((membresia) => (
                        <option key={membresia.id} value={membresia.id}>{membresia.name}</option>
                    ))}
                    
                </select>
                </Label>
                {
                    errors.Membresia && <span className='text-red-500 text-sm'>{errors.Membresia.message}</span>
                }
                {/* Date Initial */}
                <Label htmlFor="DateInitial"><span className='flex gap-2 items-center'><BsCalendar2Date className='lg:text-2xl' />Fecha Inicial</span><Input type="date" name='dateInitial'
                {...register('dateInitial',{
                    required: {
                        value: true,
                        message: 'Fecha requerido'
                    },                    
                })} 
                />
                </Label>
                {
                    errors.dateInitial && <span className='text-red-500 text-center text-sm'>{errors.dateInitial.message}</span>
                }
                {/* Date final */}
                <Label htmlFor="DateFinal"><span className='flex gap-2 items-center'><BsCalendar2Date className='lg:text-2xl' />Fecha Final</span><Input type="date" name='dateFinal'
                {...register('dateFinal',{
                    required: {
                        value: true,
                        message: 'Fecha requerido'
                    },                    
                })} 
                />
                </Label>
                {
                    errors.dateFinal && <span className='text-red-500 text-center text-sm'>{errors.dateFinal.message}</span>
                }
                {/* btn Register */}
                <Button type="submit">
                    <RiLoginBoxLine className='text-purple-800' />{ params.id ? 'Actualizar' : 'Asignar' }
                    
                </Button>                
            </form>
        </main>
    );
};
export default MemberShipsForm;