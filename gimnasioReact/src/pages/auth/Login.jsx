import {useForm} from 'react-hook-form';
import { Link } from 'react-router-dom';
//Icons
import { CiUser } from 'react-icons/ci';
import { RiLockPasswordLine, RiLoginBoxLine } from "react-icons/ri";

const Login = () => {
    const { register, handleSubmit, formState: {errors} } = useForm();

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        
    })
    return (
        <main className="w-full h-screen flex flex-col justify-center items-center lg:justify-between lg:flex-row lg:pr-48">
            <div className="hidden w-full lg:block lg:w-1/2 h-full relative">
                <img src="https://cdn.pixabay.com/photo/2020/08/05/15/25/gym-5465776_1280.png" alt="" className="w-full h-full object-fill rounded-md" />
            </div>

            <form onSubmit={onSubmit} className="w-[75%] bg-slate-300 flex flex-col justify-center items-center text-slate-600 gap-6 p-3 rounded-md md:w-[60%] md:gap-8 lg:w-[45%] xl:max-w-[30%]">
                <h1 className="text-2xl font-bold pb-2 md:pt-3">Inicio de sesión</h1>
                {/* Name */}
                <label className="flex gap-3 font-semibold md:gap-5" htmlFor="name">
                    <CiUser className='text-2xl text-gray-950' />
                    <input 
                        className='bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-gray-500 text-lg placeholder:text-gray-500' 
                        type="text"
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
                        placeholder='Nombre del Usuario' 
                    />                    
                </label>
                {
                    errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>
                }
                
                  
                {/* Password */}
                <label className="flex gap-3 font-semibold md:gap-5" htmlFor="password">
                    <RiLockPasswordLine className='text-2xl text-gray-950' />
                    <input 
                        className="bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-gray-500 text-lg placeholder:text-gray-500" 
                        type="password" 
                        name="password" 
                        id="password"
                        {...register('password', {
                            required: {
                                value: true,
                                message: 'Contraseña requerida'
                            },
                        })}
                        placeholder='Escribe la Contraseña' 
                    />
                </label>
                {
                    errors.password && <span className='text-red-500 text-sm'>{errors.password.message}</span>
                }
                {/* btn login */}
                <button htmlFor="" 
                    className="bg-sky-600 cursor-pointer flex gap-2 items-center rounded-lg p-2 text-slate-100 font-bold mb-2 hover:scale-105 hover:bg-sky-400 hover:text-slate-800"
                    type='submit'
                    >
                    <RiLoginBoxLine className='text-2xl text-purple-800' />Iniciar Sesión 
                </button>
                {/* Contenedor de registrar usuario o recuperar contraseña */}
                <div className='flex flex-col gap-2 text-center md:flex-row md:gap-4'>
                    <p className='text-gray-500 text-sm'>¿No tienes cuenta? 
                        <Link
                            to='/register'
                            className='text-sky-600 hover:text-sky-400 lg:text-base'> Registrate
                        </Link>
                    </p>
                    <p className='text-gray-500 text-sm'>¿olvido la contraseña?
                        <Link
                            to='/forget-password'
                            className='text-sky-600 hover:text-sky-400 lg:text-base'> Recuperar
                        </Link>
                    </p>

                </div>
            </form>
        </main>
    );
}

export default Login;