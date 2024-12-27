import {useForm} from 'react-hook-form';
//Icons
import { CiUser } from 'react-icons/ci';
import { RiLoginBoxLine } from "react-icons/ri";
import { MdOutlinePhoneAndroid, MdOutlinePriceChange } from "react-icons/md";
import { BsCalendar2Date } from "react-icons/bs";
import { LiaAddressCardSolid } from "react-icons/lia";

//ui
import { Input, Label, Button } from '../../../component/ui/index';

//API
import { createMember } from '../../../api/userGym.api';

const RegisterMiembro = () => {
    const { register, handleSubmit, formState: {errors}, watch, reset } = useForm();

    const onSubmit = handleSubmit(async (data) => {
        //console.log('Form data:', data);
        try {
            const rest = await createMember(data);
            //console.log('Respuesta del servidor:',rest.data);            
            reset();
            
        } catch (error) {
            console.error("Error al registrar el usuario:", error.response ? error.response.data : error.message);            
        }
        
    });

    return (
        <main className="w-full min-h-screen flex flex-col justify-center items-center">
            <form onSubmit={onSubmit} className="formRegister w-[85%] bg-slate-300 flex flex-col justify-center items-center text-slate-600 gap-6 p-3 rounded-md m-7 md:w-[55%] md:gap-8 lg:w-[47%] lg:px-8 xl:max-w-[30%]">
                <h1 className="text-xl font-bold pt-3 pb-2 md:pt-3">Registrar Miembro</h1>

                {/* Name */}
                <Label htmlFor="name"><span className='flex gap-2 items-center'><CiUser className='lg:text-2xl' />Nombre</span><Input type="text" name='name' placeholder='Escribe el nombre'
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
                })}
                />
                </Label>
                {
                    errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>
                }
                {/* LastName */}
                <Label htmlFor="lastname"><span className='flex gap-2 items-center'><CiUser className='lg:text-2xl' />Apellido</span><Input type="text" name='lastname' placeholder='Escribe el apellido'
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
                })}
                />
                </Label>
                {
                    errors.lastname && <span className='text-red-500 text-sm'>{errors.lastname.message}</span>
                }
                {/* Phone */}
                <Label htmlFor="phone"><span className='flex gap-2 items-center'><MdOutlinePhoneAndroid className='lg:text-2xl' />Telefono</span><Input type="number" name='phone' placeholder='Escribe el telefono'
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
                })} 
                />
                </Label>
                {
                    errors.phone && <span className='text-red-500 text-sm'>{errors.phone.message}</span>
                }
                {/* Address */}
                <Label htmlFor="address"><span className='flex gap-2 items-center'><LiaAddressCardSolid className='lg:text-4xl' />Dirección</span><Input type="text" name='address' placeholder='Colocar la direccion'
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
                {/* Price */}
                <Label htmlFor="price"><span className='flex gap-2 items-center'><MdOutlinePriceChange className='lg:text-4xl' />Precio</span><Input type="number" name='price' placeholder='Colocar precio'
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
                {/* btn Register */}
                <Button type="submit">
                    <RiLoginBoxLine className='text-purple-800' />
                    Registrar
                </Button>                
            </form>
        </main>
    );
}
export default RegisterMiembro;