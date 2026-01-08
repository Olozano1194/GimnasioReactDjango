//Estados
import { useEffect } from "react";
import {useForm} from 'react-hook-form';
import { useParams, useNavigate } from "react-router-dom";
//Icons
import { CiUser } from 'react-icons/ci';
import { RiLoginBoxLine } from "react-icons/ri";
import { MdOutlinePhoneAndroid } from "react-icons/md";
//import { BsCalendar2Date } from "react-icons/bs";
import { LiaAddressCardSolid } from "react-icons/lia";
//Mensajes
import { toast } from "react-hot-toast";
//ui
import { Input, Label, Button } from '../../../components/ui/index';
//API
import { createMember, updateMember, getMember } from '../../../api/action/userGym.api';
//Models
import { Miembro } from "../../../model/member.model";
//img
import Logo from '../../../../public/favicon-32x32.png'


const RegisterMiembro = () => {
    const params = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: {errors}, reset } = useForm<Miembro>();    

    const onSubmit = handleSubmit(async (data: Miembro) => {
        //console.log('Form data:', data);
        try {
            //preparamos datos para el back
            const requestData = {
                name: data.name,
                lastname: data.lastname,
                phone: data.phone,
                address: data.address,
                // dateInitial: data.dateInitial,
                // dateFinal: data.dateFinal,
                // price: Number(data.price)
            }            

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
                await createMember(requestData);
                //console.log('Respuesta del servidor:',rest.data);            
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
            //Se retrasa la navegación para que se muestre la notificación
            //setTimeout(() => {
            navigate('/dashboard/miembros');
            //}, 1000);           
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al registrar el miembro';
            toast.error(errorMessage, {
                duration: 3000,
                position: 'bottom-right',
            });              
        }
        
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (params.id) {
                    const response = await getMember(parseInt(params.id));

                    //formateamos la fecha antes de pasarla al formulario
                    // if (response.dateInitial && response.dateFinal) {
                    //     response.dateInitial = formatDate(response.dateInitial);
                    //     response.dateFinal = formatDate(response.dateFinal);                        
                    // }
                    
                    reset(response);
                }
            }catch (error) {
                console.error('Error al obtener el miembro',error);
            }
        }
        fetchUserData();
    }, [params.id, reset]);

    // const formatDate = (date: string): string => {
    //     if (!date) return ''; // Retorna un valor vacío si la fecha es undefined o null
    //     try {
    //         const [day, month, year] = date.split('-');
    //         return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    //     } catch (error) {
    //         console.error('Error al formatear la fecha:', error);
    //         return '';
    //     }
    // };

    return (
        <main className="w-full min-h-screen flex flex-col justify-center items-center">
            <form onSubmit={onSubmit} className="formRegister w-full bg-slate-300 flex flex-col justify-center items-center text-slate-600 gap-6 p-3 rounded-md m-7 md:w-[55%] md:gap-8 lg:w-[47%] lg:px-8 xl:max-w-[43%]">
                <div className='w-full flex justify-center'>
                    <h1 className="text-2xl font-bold flex justify-center items-center pb-2 md:pt-3 md:text-3xl"><img className='w-9 h-7 rounded-lg mr-1' src={Logo} alt="" />{ 
                        params.id ? (
                            <>
                            Actualizar
                            <span className='text-sky-600 pl-2'>Miembro</span>
                            </>) 
                            : (
                            <>
                            Registrar
                            <span className='text-sky-600 pl-2'>Miembro</span>
                            </>
                        )}
                    </h1>
                </div>
                {/* Name */}
                <Label htmlFor="name"><span className='flex gap-2 items-center'><CiUser className='lg:text-2xl' />Nombre</span><Input type="text" placeholder='Escribe el nombre'
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
                <Label htmlFor="lastname"><span className='flex gap-2 items-center'><CiUser className='lg:text-2xl' />Apellido</span><Input type="text" placeholder='Escribe el apellido'
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
                <Label htmlFor="phone"><span className='flex gap-2 items-center'><MdOutlinePhoneAndroid className='lg:text-2xl' />Telefono</span><Input type="tel" placeholder='Escribe el telefono'
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
                {/* Address */}
                <Label htmlFor="address"><span className='flex gap-2 items-center'><LiaAddressCardSolid className='lg:text-2xl' />Dirección</span><Input type="text" placeholder='Colocar la direccion'
                {...register('address',{
                    required: {
                        value: true,
                        message: 'Dirección requerido'
                    },
                    maxLength: {
                        value: 50,
                        message: 'La dirección debe tener como maximo 50 letras'
                    },                    
                })} 
                />
                </Label>
                {
                    errors.address && <span className='text-red-500 text-sm'>{errors.address.message}</span>
                }                
                {/* btn Register */}
                <Button type="submit">
                    <RiLoginBoxLine className='text-purple-800' />{ params.id ? 'Actualizar' : 'Registrar' }
                    
                </Button>                
            </form>
        </main>
    );
}
export default RegisterMiembro;