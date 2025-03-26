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
import { createMemberShips, updateMemberShips, getMemberShips } from '../../../api/memberShips.api';


const MemberShipsForm = () => {
    const params = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: {errors}, watch, reset } = useForm();    
    
    const onSubmit = handleSubmit(async (data) => {
        //console.log('Form data:', data);
        try {
        if (params.id) {
            await updateMemberShips(params.id, data);
            //console.log('Actualizando miembro:', params.id);
            toast.success('Membresía Actualizada', {
                duration: 3000,
                position: 'bottom-right',
                style: {
                    background: '#4b5563',   // Fondo negro
                    color: '#fff',           // Texto blanco
                    padding: '16px',
                    borderRadios: '8px',
                },
            });                 
        }else {
            await createMemberShips(data);
            //console.log('Respuesta del servidor:',rest.data);            
            reset();
            toast.success('Membresía Creada', {
                duration: 3000,
                position: 'bottom-right',
                style: {
                    background: '#4b5563',   // Fondo negro
                    color: '#fff',           // Texto blanco
                    padding: '16px',
                    borderRadios: '8px',
                },
            });                
        }
        navigate('/dashboard/memberships-list');
                 
        } catch (error) {
            console.error("Error al registrar el usuario:", error.response ? error.response.data : error.message);            
        }
            
    });
    
    useEffect(() => {
        const axiosUserData = async () => {
            try {
            if (params.id) {
                const response = await getMemberShips(params.id);
                reset(response);
            }
            }catch (error) {
                console.error('Error al obtener la membresía',error);
            }
        }
        axiosUserData();
    }, [params.id, reset]);
    
    return (
        <main className="w-full min-h-screen flex flex-col justify-center items-center">
            <form onSubmit={onSubmit} className="formRegister w-[85%] bg-slate-300 flex flex-col justify-center items-center text-slate-600 gap-6 p-3 rounded-md m-7 md:w-[55%] md:gap-8 lg:w-[47%] lg:px-8 xl:max-w-[43%]">
                <h1 className="text-xl font-bold pt-3 pb-2 md:pt-3">{ params.id ? 'Actualizar Membresía' : 'Registrar Membresía' }</h1>

                {/* Name */}
                <Label htmlFor="name"><span className='flex gap-2 items-center'><FaTag className='lg:text-2xl xl:text-xl' />Nombre del plan</span><select name='name' className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-dark text-lg placeholder:text-gray-500'
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
                <Label htmlFor="price"><span className='flex gap-2 items-center'><MdOutlinePriceChange className='lg:text-2xl' />Precio</   span><Input type="number" name='price' placeholder='Colocar precio'
                {...register('price',{
                    required: {
                        value: true,
                        message: 'Precio requerido'
                    },                    
                })} 
                />
                </Label>
                {
                    errors.price && <span className='text-red-500 text-sm'>{errors.price.message}</span>
                }
                {/* Duration */}
                <Label htmlFor="duration"><span className='flex gap-2 items-center'><GiDuration className='lg:text-2xl' />Duración</span><Input type="number" name='duration' placeholder='Escribe el nombre'
                {...register('duration',{
                    required: {
                        value: true,
                        message: 'Duración requerida'
                    },
                    min: {
                        value: 15,
                        message: 'La duración debe ser de almenos 15 días'
                    },
                    max: {
                        value: 30,
                        message: 'La duración no debe exceder los 30 días'
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