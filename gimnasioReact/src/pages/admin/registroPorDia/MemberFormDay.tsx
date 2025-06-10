import {useForm} from 'react-hook-form';
import { useParams, useNavigate } from "react-router-dom";
//Estados
import { useEffect } from "react";
//Icons
import { CiUser } from 'react-icons/ci';
import { RiLoginBoxLine } from "react-icons/ri";
import { MdOutlinePhoneAndroid, MdOutlinePriceChange } from "react-icons/md";
import { BsCalendar2Date } from "react-icons/bs";
//Mensajes
import { toast } from "react-hot-toast";
//ui
import { Input, Label, Button } from '../../../components/ui/index';
//API
import { createMemberDay, getMember, updateMember } from '../../../api/userGymDay.api';
//Models
import { MemberDay } from '../../../model/memberDay.model';


const RegisterMiembroDay = () => {
    const params = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: {errors}, reset } = useForm<MemberDay>();

    const onSubmit = handleSubmit(async (data: MemberDay) => {
        
        try {
            const requestData = {
                name: data.name,
                lastname: data.lastname,
                phone: data.phone,
                dateInitial: data.dateInitial,
                price: data.price,
            };

            if (params.id) {
                await updateMember(parseInt(params.id), requestData);
                //console.log('Actualizando miembro:', params.id);
                toast.success('Miembro Actualizado', {
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
                await createMemberDay(requestData);//console.log('Respuesta del servidor:',rest.data);            
                reset();
                toast.success('Miembro Creado', {
                    duration: 3000,
                    position: 'bottom-right',
                    style: {
                        background: '#4b5563',   // Fondo negro
                        color: '#fff',           // Texto blanco
                        padding: '16px',
                        borderRadius: '8px',
                    },

                });   
            }
            navigate('/dashboard/miembros-day');
            
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al registrar el miembro diario';
            toast.error(errorMessage, {
                duration: 3000,
                position: 'bottom-right',
            });             
        }
        
    });

    useEffect(() => {
        const axiosUserData = async () => {
            try {
                if (params.id) {
                    const response = await getMember(parseInt(params.id));

                    //formateamos la fecha antes de pasarla al formulario
                    if (response.dateInitial) {
                        response.dateInitial = formatDate(response.dateInitial);                                               
                    }
                    
                    reset(response);
                }
            }catch (error) {
                console.error('Error al obtener el miembro',error);
            }
        }
        axiosUserData();
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

    return (
        <main className="w-full min-h-screen flex flex-col justify-center items-center">
            <form onSubmit={onSubmit} className="formRegister w-[85%] bg-slate-300 flex flex-col justify-center items-center text-slate-600 gap-6 p-3 rounded-md m-7 md:w-[55%] md:gap-8 lg:w-[47%] lg:px-8 xl:max-w-[43%]">
                <h1 className="text-xl font-bold pt-3 pb-2 md:pt-3">{params.id ? 'Actualizar Miembro Diario' : 'Registrar Miembro Diario'}</h1>

                {/* Name */}
                <Label htmlFor="name" ><span className='flex gap-2 items-center'><CiUser className='lg:text-2xl' />Nombre</span><Input type="text" placeholder='Escribe el nombre'
                {...register('name',{
                    required: {
                        value: true,
                        message: 'Nombre requerido'
                    },
                    minLength: {
                        value: 4,
                        message: 'El nombre debe tener como minimo 4 letras'
                    },
                    maxLength: {
                        value: 20,
                        message: 'El nombre debe tener como maximo 20 letras'
                    },
                    pattern: {
                        value: /^[a-zA-Z]+$/,
                        message: 'Nombre invalido'
                    },
                })}
                />
                </Label>
                {
                    errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>
                }
                {/* LastName */}
                <Label htmlFor="lastname" ><span className='flex gap-2 items-center'><CiUser className='lg:text-2xl' />Apellido</span><Input type="text" placeholder='Escribe el apellido'
                {...register('lastname',{
                    required: {
                        value: true,
                        message: 'Apellido requerido'
                    },
                    minLength: {
                        value: 5,
                        message: 'El apellido debe tener como minimo 5 letras'
                    },
                    maxLength: {
                        value: 20,
                        message: 'El apellido debe tener como maximo 20 letras'
                    },
                    pattern: {
                        value: /^[a-zA-Z]+$/,
                        message: 'Apellido invalido'
                    },
                })}
                />
                </Label>
                {
                    errors.lastname && <span className='text-red-500 text-sm'>{errors.lastname.message}</span>
                }
                {/* Phone */}
                <Label htmlFor="phone" ><span className='flex gap-2 items-center'><MdOutlinePhoneAndroid className='lg:text-2xl' />Telefono</span><Input type="tel" placeholder='Escribe el telefono'
                {...register('phone',{
                    required: {
                        value: true,
                        message: 'Telefono requerido'
                    },
                    minLength: {
                        value: 10,
                        message: 'El Telefono debe tener como minimo 10 números'
                    },
                    maxLength: {
                        value: 10,
                        message: 'El Telefono debe tener como maximo 10 número'
                    },
                    pattern: {
                        value: /^[0-9]+$/,
                        message: 'Numero celular invalido'
                    },
                })} 
                />
                </Label>
                {
                    errors.phone && <span className='text-red-500 text-sm'>{errors.phone.message}</span>
                }               
                {/* Date Initial */}
                <Label htmlFor="DateInitial"><span className='flex gap-2 items-center'><BsCalendar2Date className='lg:text-xl' />Fecha Inicial</span><Input type="date" 
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
                {/* Price */}
                <Label htmlFor="price"><span className='flex gap-2 items-center'><MdOutlinePriceChange className='lg:text-2xl' />Precio</span><Input type="text" inputMode='decimal' placeholder='Colocar precio'
                {...register('price',{
                    required: {
                        value: true,
                        message: 'Precio requerido'
                    },
                    pattern: {
                        value: /^[0-9]+$/,
                        message: 'Precio invalido'
                    },                    
                })} 
                />
                </Label>
                {
                    errors.price && <span className='text-red-500 text-sm'>{errors.price.message}</span>
                }
                {/* btn Register */}
                <Button type="submit">
                    <RiLoginBoxLine className='text-purple-800' />
                    {params.id ? 'Actualizar' : 'Registrar'}
                </Button>                
            </form>
        </main>
    );
}
export default RegisterMiembroDay;