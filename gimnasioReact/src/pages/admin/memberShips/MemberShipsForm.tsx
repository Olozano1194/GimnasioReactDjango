import {useForm} from 'react-hook-form';
import { useParams, useNavigate } from "react-router-dom";
//Estados
import { useEffect } from "react";
//Icons
import { RiLoginBoxLine } from "react-icons/ri";
import { MdOutlinePriceChange } from "react-icons/md";
import { GiDuration } from "react-icons/gi";
import { FaTag } from 'react-icons/fa';
//Mensajes
import { toast } from "react-hot-toast";
//ui
import { Input, Label, Button } from '../../../components/ui/index';
//API
import { createMemberShips, updateMemberShips, getMemberShips } from '../../../api/action/memberShips.api';
//Models
import { Membresia } from '../../../model/memberShips.model';
//img
import Logo from '../../../../public/favicon-32x32.png';


const MemberShipsForm = () => {
    const params = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: {errors}, reset } = useForm<Membresia>();    
    
    const onSubmit = handleSubmit(async (data: Membresia) => {
        //console.log('Form data:', data);
        try {
            const requestData = {
                name: data.name,
                price: Number(data.price),
                duration: data.duration,
            };

            if (params.id) {
                await updateMemberShips(parseInt(params.id), requestData);
                //console.log('Actualizando miembro:', params.id);
                toast.success('Membresía Actualizada', {
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
            await createMemberShips(requestData);
            //console.log('Respuesta del servidor:',rest.data);            
            reset();
            toast.success('Membresía Creada', {
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
        navigate('/dashboard/memberships-list');
                 
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al registrar la membresía';
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
                const response = await getMemberShips(parseInt(params.id));
                reset(response);
            }
            }catch (error) {
                console.error('Error al obtener la membresía',error);
            }
        }
        fetchUserData();
    }, [params.id, reset]);
    
    return (
        <main className="w-full min-h-screen flex flex-col justify-center items-center">
            <form onSubmit={onSubmit} className="formRegister w-full bg-slate-300 flex flex-col justify-center items-center text-slate-600 gap-6 p-4 rounded-md m-7 md:w-[55%] md:gap-8 lg:w-[47%] lg:px-8 xl:max-w-[43%]">
                <div className='w-full flex justify-center'>
                    <h1 className="text-2xl font-bold flex justify-center items-center pb-2 md:pt-3 md:text-3xl"><img className='w-9 h-7 rounded-lg mr-1' src={Logo} alt="" />{ 
                        params.id ? (
                            <>
                            Actualizar
                            <span className='text-sky-600 pl-2'>Membresía</span>
                            </>) 
                            : (
                            <>
                            Registrar
                            <span className='text-sky-600 pl-2'>Membresía</span>
                            </>
                        )}
                    </h1>
                </div>
                {/* Name */}
                <Label htmlFor="name"><span className='flex gap-2 items-center'><FaTag className='lg:text-2xl xl:text-xl' />Nombre del plan</span><select className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-dark text-lg placeholder:text-gray-500'
                    {...register('name',{
                        required: {
                            value: true,
                            message: 'Nombre requerido'
                        },                   
                    })}
                >
                    <option value="">Escoge El Plan</option>
                    <option value="basico">Básico</option>
                    <option value="premium">Premium</option>
                    <option value="VIP">VIP</option>
                    </select>
                </Label>
                {
                    errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>                }
                
                {/* Price */}
                <Label htmlFor="price"><span className='flex gap-2 items-center'><MdOutlinePriceChange className='lg:text-2xl' />Precio</   span><Input inputMode='decimal' type="text" placeholder='Colocar precio'
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
                {/* Duration */}
                <Label htmlFor="duration"><span className='flex gap-2 items-center'><GiDuration className='lg:text-2xl' />Duración</span><Input type="text" inputMode='decimal' placeholder='Duración en días (ej: 15, 30, 45)'
                    {...register('duration',{
                        required: {
                            value: true,
                            message: 'Duración requerida'
                        },
                        validate: (value) => {
                            const num = Number(value);
                            return [15, 30, 45].includes(num) || 'Solo se permiten los valores 15, 30 o 45';
                        },
                        pattern: {
                            value: /^[0-9]+$/,
                            message: 'Duración invalida'
                        },
                    })}
                    />
                </Label>
                {
                    errors.duration && <span className='text-red-500 text-sm'>{errors.duration.message}</span>
                }               
                {/* btn Register */}
                <Button type="submit">
                    <RiLoginBoxLine className='text-purple-800' />{ params.id ? 'Actualizar' : 'Registrar' }
                    
                </Button>                
            </form>
        </main>
    );
};
export default MemberShipsForm;