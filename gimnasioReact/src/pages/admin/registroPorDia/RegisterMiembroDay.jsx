import {useForm} from 'react-hook-form';
//Icons
import { CiUser } from 'react-icons/ci';
import { RiLockPasswordLine, RiLoginBoxLine } from "react-icons/ri";
import { MdOutlinePhoneAndroid, MdOutlinePriceChange } from "react-icons/md";
import { BsCalendar2Date } from "react-icons/bs";

const RegisterMiembroDay = () => {
    const { register, handleSubmit, formState: {errors}, watch } = useForm();

    const onSubmit = handleSubmit((data) => {
        console.log(data);        
    })

    return (
        <main className="w-full min-h-screen flex flex-col justify-center items-center">
            <form onSubmit={onSubmit} className="formRegister w-[85%] bg-slate-300 flex flex-col justify-center items-center text-slate-600 gap-6 p-3 rounded-md m-7 md:w-[55%] md:gap-8 lg:w-[47%] lg:px-8 xl:max-w-[30%]">
                <h1 className="text-xl font-bold pt-3 pb-2 md:pt-3">Registrar Miembro diario</h1>

                {/* Name */}
                <label htmlFor="name" className="w-full flex flex-col justify-center items-center gap-3 font-semibold text-xl md:gap-5 lg:flex-row lg:justify-between"><span className='flex gap-2 items-center'><CiUser className='lg:text-2xl' />Nombre</span><input type="text" className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-dark text-lg placeholder:text-gray-500' placeholder='Escribe el nombre'
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
                </label>
                {
                    errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>
                }
                {/* LastName */}
                <label htmlFor="lastname" className="w-full flex flex-col justify-center items-center gap-3 font-semibold text-xl md:gap-5 lg:flex-row lg:justify-between"><span className='flex gap-2 items-center'><CiUser className='lg:text-2xl' />Apellido</span><input type="text" className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-dark text-lg placeholder:text-gray-500' placeholder='Escribe el apellido'
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
                </label>
                {
                    errors.lastname && <span className='text-red-500 text-sm'>{errors.lastname.message}</span>
                }
                {/* Phone */}
                <label htmlFor="phone" className="w-full flex flex-col justify-center items-center gap-3 font-semibold text-xl md:gap-5 lg:flex-row lg:justify-between"><span className='flex gap-2 items-center'><MdOutlinePhoneAndroid className='lg:text-2xl' />Telefono</span><input type="number" className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-dark text-lg placeholder:text-gray-500' placeholder='Escribe el telefono'
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
                </label>
                {
                    errors.phone && <span className='text-red-500 text-sm'>{errors.phone.message}</span>
                }               
                {/* Date Initial */}
                <label htmlFor="DateInitial" className="w-full flex flex-col justify-center items-center gap-3 font-semibold text-xl md:gap-5 lg:flex-row lg:justify-between"><span className='flex gap-2 items-center'><BsCalendar2Date className='lg:text-2xl' />Fecha Inicial</span><input type="date" className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-dark text-lg'
                {...register('dateInitial',{
                    required: {
                        value: true,
                        message: 'Fecha requerido'
                    },                    
                })} 
                />
                </label>
                {
                    errors.dateInitial && <span className='text-red-500 text-center text-sm'>{errors.dateInitial.message}</span>
                }
                {/* Price */}
                <label htmlFor="price" className="w-full flex flex-col justify-center items-center gap-3 font-semibold text-xl md:gap-5 lg:flex-row lg:justify-between"><span className='flex gap-2 items-center'><MdOutlinePriceChange className='lg:text-4xl' />Precio</span><input type="number" className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-dark text-lg placeholder:text-gray-500 lg:w-96' placeholder='Colocar precio'
                {...register('price',{
                    required: {
                        value: true,
                        message: 'Precio requerido'
                    },                    
                })} 
                />
                </label>
                {
                    errors.price && <span className='text-red-500 text-sm'>{errors.price.message}</span>
                }
                {/* btn Register */}
                <button type="submit" className="bg-sky-600 cursor-pointer flex gap-2 items-center rounded-lg p-4 text-slate-100 text-lg font-bold mb-2 hover:scale-105 hover:bg-sky-400 hover:text-slate-800">
                    <RiLoginBoxLine className='text-purple-800' />
                    Registrar
                </button>                
            </form>
        </main>
    );
}
export default RegisterMiembroDay;